'use client';

import { FitAddon } from '@xterm/addon-fit';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import type { ConnState } from '@/hooks/useConsoleSocket';
import { stripPsClixmlNoise } from '@/lib/stripPsClixml';

export type ShellMode = 'powershell' | 'cmd' | 'powershell_admin';

type SessionJson = {
  whoami?: string;
  userName?: string;
  userDomain?: string;
  host?: string;
  home?: string;
  isElevated?: boolean;
};

function parseSession(raw: unknown): SessionJson {
  if (typeof raw === 'string') {
    return JSON.parse(raw) as SessionJson;
  }
  return raw as SessionJson;
}

type Props = {
  socket: Socket | null;
  conn: ConnState;
  portalRequest: (type: string, payload?: Record<string, unknown>) => Promise<unknown>;
  shell: ShellMode;
  title: string;
  accountLine?: string | null;
  machineLine?: string | null;
  /** Agent process is elevated — show [ADMIN] hint for PowerShell. */
  agentElevated?: boolean;
  /** Hide outer title / badge / meta when parent shows tabs + shared header. */
  hideChrome?: boolean;
  /** When false, panel is hidden — refit xterm when user switches tab. */
  isActive?: boolean;
};

export default function TerminalPanel({
  socket,
  conn,
  portalRequest,
  shell,
  title,
  accountLine,
  machineLine,
  agentElevated = false,
  hideChrome = false,
  isActive = true,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isActiveRef = useRef(isActive);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  isActiveRef.current = isActive;

  useEffect(() => {
    if (!socket) return;
    const el = hostRef.current;
    if (!el) return;

    const term = new Terminal({
      allowProposedApi: true,
      cursorBlink: true,
      convertEol: true,
      scrollback: 10000,
      lineHeight: 1.28,
      fontFamily:
        'var(--font-fira-code), var(--font-console-mono), "Cascadia Code", "Fira Code", ui-monospace, monospace',
      fontSize: 13,
      theme: {
        background: '#030308',
        foreground: '#c8fff4',
        cursor: '#00f0ff',
        selectionBackground: 'rgba(0, 240, 255, 0.22)',
        green: '#39ff14',
        cyan: '#22d3ee',
        brightGreen: '#39ff14',
        brightCyan: '#00f0ff',
      },
    });
    const unicode11 = new Unicode11Addon();
    term.loadAddon(unicode11);
    term.unicode.activeVersion = '11';
    const webLinks = new WebLinksAddon((ev, uri) => {
      ev.preventDefault();
      window.open(uri, '_blank', 'noopener,noreferrer');
    });
    term.loadAddon(webLinks);
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(el);
    fit.fit();

    const stopPty = () => {
      const sid = sessionIdRef.current;
      sessionIdRef.current = null;
      if (sid && socket.connected) {
        socket.emit('pty:close', { sessionId: sid });
      }
    };

    const startPty = () => {
      if (!socket.connected) return;
      stopPty();
      fit.fit();
      const sid = crypto.randomUUID();
      sessionIdRef.current = sid;
      socket.emit('pty:start', {
        sessionId: sid,
        shell,
        rows: term.rows,
        cols: term.cols,
      });
    };

    const emitResize = () => {
      const sid = sessionIdRef.current;
      if (!sid || !socket.connected) return;
      socket.emit('pty:resize', {
        sessionId: sid,
        rows: term.rows,
        cols: term.cols,
      });
    };

    const scheduleResize = () => {
      if (!isActiveRef.current) return;
      fit.fit();
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        resizeTimerRef.current = null;
        emitResize();
      }, 80);
    };

    const paintBanner = async () => {
      term.reset();
      let who = accountLine?.trim();
      let machine = machineLine?.trim();
      if (!who || !machine) {
        try {
          const raw = await portalRequest('session_info');
          const j = parseSession(raw);
          if (!who) {
            who =
              j.whoami ||
              `${j.userDomain || ''}\\${j.userName || ''}`.replace(/^\\+/, '').replace(/\\+$/, '');
            const adm = j.isElevated ? ' (Administrator / elevated)' : '';
            who = `${who}${adm}`.trim();
          }
          if (!machine) {
            machine = `${j.host || ''} · ${j.home || ''}`.trim();
          }
        } catch {
          who = who || '(session load failed)';
        }
      }
      if (who) {
        term.write(`\x1b[33m\x1b[1m${who}\x1b[0m\r\n`);
      }
      if (machine) {
        term.write(`\x1b[90m${machine}\x1b[0m\r\n`);
      }
      const label =
        shell === 'cmd' ? 'CMD' : shell === 'powershell_admin' ? 'PowerShell [elevated tab]' : 'PowerShell';
      const adm =
        shell !== 'cmd' && agentElevated ? ' \x1b[31m[ADMIN]\x1b[0m' : '';
      term.write(
        `\x1b[38;2;0;240;255m${label}\x1b[0m${adm} — ConPTY (x64 System32). UTF-8. Interactive shell; streams match Windows Terminal (combined view).\r\n`,
      );
      if (!hideChrome) {
        term.write(
          `\x1b[90mQuick tools panel uses non-interactive script runner (separate from this PTY).\x1b[0m\r\n`,
        );
      }
      term.write('\r\n');
    };

    const onPtyOut = (msg: {
      sessionId?: string;
      data?: string;
      error?: string;
      eof?: boolean;
    }) => {
      if (msg.sessionId !== sessionIdRef.current) return;
      if (msg.error) {
        term.writeln(`\r\n\x1b[31m${msg.error}\x1b[0m\r\n`);
        return;
      }
      if (msg.eof) {
        term.writeln('\r\n\x1b[33mShell exited — starting a new session…\x1b[0m\r\n');
        startPty();
        return;
      }
      let data = msg.data ?? '';
      if (shell !== 'cmd') {
        data = stripPsClixmlNoise(data);
      }
      term.write(data);
    };

    const onConnect = () => {
      void (async () => {
        await paintBanner();
        startPty();
      })();
    };

    const onDisconnect = () => {
      stopPty();
      term.writeln('\r\n\x1b[31mSocket disconnected.\x1b[0m\r\n');
    };

    const onLog = (msg: { line?: string }) => {
      term.writeln(`\x1b[33m${msg?.line ?? ''}\x1b[0m`);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('pty:output', onPtyOut);
    socket.on('log:line', onLog);

    term.onData((data) => {
      const sid = sessionIdRef.current;
      if (!sid || !socket.connected) return;
      socket.emit('pty:input', { sessionId: sid, data });
    });

    const pasteFromClipboard = () => {
      if (!navigator.clipboard?.readText) {
        term.writeln('\r\n\x1b[33mClipboard API unavailable — use HTTPS or localhost.\x1b[0m\r\n');
        return;
      }
      void navigator.clipboard.readText().then(
        (t) => {
          if (t) {
            const sid = sessionIdRef.current;
            if (sid && socket.connected) {
              socket.emit('pty:input', { sessionId: sid, data: t });
            }
          }
        },
        () => {
          term.writeln(
            '\r\n\x1b[33mPaste blocked by the browser — click inside the terminal and try Ctrl+Shift+V.\x1b[0m\r\n',
          );
        },
      );
    };

    term.attachCustomKeyEventHandler((e) => {
      if (e.type !== 'keydown') {
        return true;
      }
      const mod = e.ctrlKey || e.metaKey;
      if (mod && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        pasteFromClipboard();
        return false;
      }
      if (e.shiftKey && e.key === 'Insert') {
        e.preventDefault();
        pasteFromClipboard();
        return false;
      }
      if (mod && (e.key === 'c' || e.key === 'C')) {
        const sel = term.getSelection();
        if (sel) {
          e.preventDefault();
          void navigator.clipboard.writeText(sel).catch(() => {});
          return false;
        }
      }
      return true;
    });

    const onPasteDom = (ev: ClipboardEvent) => {
      const text = ev.clipboardData?.getData('text/plain');
      if (text == null || text === '') {
        return;
      }
      ev.preventDefault();
      ev.stopPropagation();
      const sid = sessionIdRef.current;
      if (sid && socket.connected) {
        socket.emit('pty:input', { sessionId: sid, data: text });
      }
    };
    const root = term.element;
    if (root) {
      root.addEventListener('paste', onPasteDom, true);
    }

    const ro = new ResizeObserver(() => {
      if (isActiveRef.current) {
        scheduleResize();
      }
    });
    ro.observe(el);

    termRef.current = term;
    fitRef.current = fit;

    if (socket.connected) {
      void (async () => {
        await paintBanner();
        startPty();
      })();
    }

    return () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = null;
      }
      ro.disconnect();
      if (root) {
        root.removeEventListener('paste', onPasteDom, true);
      }
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('pty:output', onPtyOut);
      socket.off('log:line', onLog);
      stopPty();
      term.dispose();
      termRef.current = null;
      fitRef.current = null;
    };
  }, [socket, portalRequest, shell, accountLine, machineLine, agentElevated, hideChrome]);

  useEffect(() => {
    if (!isActive || !fitRef.current) return;
    const id = requestAnimationFrame(() => {
      fitRef.current?.fit();
      termRef.current?.focus();
      const sid = sessionIdRef.current;
      const term = termRef.current;
      const s = socket;
      if (sid && term && s?.connected) {
        s.emit('pty:resize', { sessionId: sid, rows: term.rows, cols: term.cols });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [isActive, socket]);

  const badge =
    conn === 'open'
      ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40'
      : conn === 'error'
        ? 'bg-rose-500/15 text-rose-300 ring-rose-500/40'
        : 'bg-cyan-500/15 text-cyan-200 ring-cyan-500/35';

  const shellBadge =
    shell === 'cmd' ? 'cmd.exe' : shell === 'powershell_admin' ? 'powershell (admin tab)' : 'powershell';

  return (
    <div className="relative flex h-full min-h-[280px] flex-col gap-2 rounded-xl border border-cyan-500/25 bg-black/55 p-2 shadow-[0_0_40px_rgba(0,240,255,0.08)] ring-1 ring-emerald-400/15 backdrop-blur-md">
      {!socket ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/80 text-sm text-cyan-200/90">
          API connecting…
        </div>
      ) : null}
      {!hideChrome ? (
        <div className="flex flex-col gap-1 border-b border-cyan-500/20 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="bg-gradient-to-r from-cyan-200 to-emerald-300 bg-clip-text font-mono text-sm font-semibold tracking-wide text-transparent">
              {title}
            </h3>
            <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-cyan-200">
              {shellBadge}
            </span>
            {shell === 'powershell_admin' || (shell === 'powershell' && agentElevated) ? (
              <span className="rounded border border-rose-500/50 bg-rose-950/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.35)]">
                [ADMIN]
              </span>
            ) : null}
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${badge}`}
            >
              {conn === 'open' ? 'Live' : conn === 'error' ? 'Error' : '…'}
            </span>
          </div>
          {accountLine ? (
            <p className="font-mono text-[11px] font-medium leading-snug text-emerald-200/95">{accountLine}</p>
          ) : null}
          {machineLine ? (
            <p className="text-[10px] leading-snug text-cyan-700/90">{machineLine}</p>
          ) : null}
        </div>
      ) : null}
      <div
        ref={hostRef}
        className="cyber-scroll min-h-[220px] flex-1 overflow-hidden rounded-lg border border-cyan-900/35 bg-[#030308] p-1.5 outline-none focus-within:shadow-[0_0_24px_rgba(57,255,20,0.1)] focus-within:ring-2 focus-within:ring-cyan-400/30"
      />
    </div>
  );
}
