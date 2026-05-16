'use client';

import * as Tabs from '@radix-ui/react-tabs';
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  HardDrive,
  LayoutGrid,
  Maximize2,
  Menu,
  Minimize2,
  MonitorDot,
  Terminal as TerminalIcon,
  Wrench,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useConsoleSocket } from '@/hooks/useConsoleSocket';
import TerminalPanel from '@/components/TerminalPanel';
import QuickToolsPanel from '@/components/QuickToolsPanel';
import Dashboard from '@/components/dashboard';

type Drive = { letter: string; path: string; freeGb: number | null };
type DirEntry = { name: string; isDir: boolean; size: number | null };
type DirJson = { ok: boolean; path?: string; entries?: DirEntry[]; error?: string };
type AppRow = { name?: string; version?: string; location?: string; path?: string };
type ScreenMonitorRow = { index: number; width: number; height: number; label: string };

function parseJson<T>(raw: unknown): T {
  if (typeof raw === 'string') {
    return JSON.parse(raw) as T;
  }
  return raw as T;
}

/** Parent folder for explorer `path`, or null to leave drive list (at drive root). */
function explorerParentPath(p: string): string | null {
  let t = p.replace(/\//g, '\\').trim();
  while (t.endsWith('\\')) t = t.slice(0, -1);
  if (!t) return null;
  if (/^[A-Za-z]:$/.test(t)) return null;
  const u = t.lastIndexOf('\\');
  if (u <= 0) return null;
  const parent = t.slice(0, u);
  if (/^[A-Za-z]:$/.test(parent)) return `${parent}\\`;
  return `${parent}\\`;
}

export default function ConsoleDashboard() {
  const { socket, conn, agentReady, portalRequest } = useConsoleSocket();
  const [path, setPath] = useState('');
  const [dirLoading, setDirLoading] = useState(false);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [entries, setEntries] = useState<DirEntry[]>([]);
  const [explorerError, setExplorerError] = useState<string | null>(null);
  const [appsTab, setAppsTab] = useState<'installed' | 'start'>('installed');
  const [installed, setInstalled] = useState<AppRow[]>([]);
  const [startMenu, setStartMenu] = useState<AppRow[]>([]);
  const [appQuery, setAppQuery] = useState('');
  const [screenSrc, setScreenSrc] = useState<string | null>(null);
  const [screenMeta, setScreenMeta] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [screenHint, setScreenHint] = useState<string | null>(null);
  const [accountLine, setAccountLine] = useState<string | null>(null);
  const [machineLine, setMachineLine] = useState<string | null>(null);
  const [liveDesktop, setLiveDesktop] = useState(false);
  /** mss monitor index: 1 = first physical display (see python mss monitors). */
  const [screenMonitor, setScreenMonitor] = useState(1);
  const screenMonitorRef = useRef(screenMonitor);
  screenMonitorRef.current = screenMonitor;
  const lastFrameSeq = useRef(0);
  const liveWatchdog = useRef<ReturnType<typeof setInterval> | null>(null);
  const gotLiveFrame = useRef(false);
  const liveNoFrameNotified = useRef(false);
  const screenViewerRef = useRef<HTMLDivElement>(null);
  const [screenFullscreen, setScreenFullscreen] = useState(false);
  const [monitorOptions, setMonitorOptions] = useState<ScreenMonitorRow[]>([
    { index: 1, width: 0, height: 0, label: 'Display 1' },
  ]);
  const autoMonitorPickDone = useRef(false);
  const [shellTab, setShellTab] = useState<'powershell' | 'cmd'>('powershell');
  const [agentElevated, setAgentElevated] = useState(false);
  const [leftTab, setLeftTab] = useState<'explorer' | 'apps' | 'screen' | 'tools' | 'dashboard'>('explorer');
  const terminalSectionRef = useRef<HTMLDivElement>(null);
  const [sideLog, setSideLog] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [terminalFocus, setTerminalFocus] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [tabHeapMb, setTabHeapMb] = useState<number | null>(null);

  type SessionInfo = {
    whoami?: string;
    userName?: string;
    userDomain?: string;
    host?: string;
    home?: string;
    isElevated?: boolean;
  };

  const refreshSession = useCallback(async () => {
    try {
      const raw = await portalRequest('session_info');
      const j = parseJson<SessionInfo>(raw);
      const who =
        j.whoami ||
        `${j.userDomain || ''}\\${j.userName || ''}`.replace(/^\\+/, '').replace(/\\+$/, '');
      const admin = j.isElevated ? ' (Administrator / elevated)' : '';
      setAccountLine(`${who}${admin}`);
      setMachineLine(`${j.host || ''} · ${j.home || ''}`);
      setAgentElevated(Boolean(j.isElevated));
    } catch {
      setAccountLine(null);
      setMachineLine(null);
      setAgentElevated(false);
    }
  }, [portalRequest]);

  const refreshDrives = useCallback(async () => {
    try {
      setExplorerError(null);
      const raw = await portalRequest('list_drives');
      const list = parseJson<Drive[]>(raw);
      setDrives(Array.isArray(list) ? list : []);
    } catch (e) {
      setDrives([]);
      setExplorerError(e instanceof Error ? e.message : String(e));
    }
  }, [portalRequest]);

  const refreshDir = useCallback(
    async (p: string) => {
      setDirLoading(true);
      setExplorerError(null);
      try {
        const raw = await portalRequest('list_dir_json', { path: p });
        const j = parseJson<DirJson>(raw);
        if (!j.ok) {
          setExplorerError(j.error || 'list_dir_json failed');
          setEntries([]);
          return;
        }
        setPath(j.path || p);
        setEntries(j.entries || []);
      } catch (e) {
        setExplorerError(e instanceof Error ? e.message : String(e));
        setEntries([]);
      } finally {
        setDirLoading(false);
      }
    },
    [portalRequest],
  );

  const refreshApps = useCallback(async () => {
    try {
      const raw = await portalRequest('list_apps_json');
      const rows = parseJson<unknown>(raw);
      const arr = Array.isArray(rows) ? rows : rows ? [rows] : [];
      setInstalled(arr as AppRow[]);
    } catch {
      setInstalled([]);
    }
    try {
      const raw2 = await portalRequest('list_start_menu_json');
      const rows2 = parseJson<unknown>(raw2);
      const arr2 = Array.isArray(rows2) ? rows2 : rows2 ? [rows2] : [];
      setStartMenu(arr2 as AppRow[]);
    } catch {
      setStartMenu([]);
    }
  }, [portalRequest]);

  const captureScreen = useCallback(
    async (opts?: { preserveHint?: boolean }) => {
      if (!opts?.preserveHint) {
        setScreenHint(null);
      }
      try {
        const raw = await portalRequest('screen_snapshot', { monitor: screenMonitor });
        const snap = parseJson<{
          ok?: boolean;
          base64?: string;
          width: number;
          height: number;
          left: number;
          top: number;
          error?: string;
        }>(raw);
        if (!snap.ok) {
          setScreenHint(snap.error || 'Snapshot failed');
          return;
        }
        const b64 = String(snap.base64 ?? '').replace(/\s+/g, '');
        if (!b64) {
          setScreenHint('Snapshot: empty image data');
          return;
        }
        setScreenSrc(`data:image/jpeg;base64,${b64}`);
        setScreenMeta({
          left: snap.left,
          top: snap.top,
          width: snap.width,
          height: snap.height,
        });
      } catch (e) {
        setScreenHint(e instanceof Error ? e.message : String(e));
      }
    },
    [portalRequest, screenMonitor],
  );

  const reloadAgentData = useCallback(async () => {
    await refreshDrives();
    setEntries([]);
    await refreshApps();
    await refreshSession();
  }, [refreshDrives, refreshApps, refreshSession]);

  useEffect(() => {
    if (!socket || conn !== 'open') return;
    void reloadAgentData();
  }, [socket, conn, reloadAgentData]);

  /** Browser often connects before the Windows agent registers — retry when agent comes online. */
  useEffect(() => {
    if (!socket || conn !== 'open' || !agentReady) return;
    void reloadAgentData();
  }, [socket, conn, agentReady, reloadAgentData]);

  useEffect(() => {
    if (!socket || conn !== 'open' || agentReady) return;
    const t = window.setInterval(() => {
      void reloadAgentData();
    }, 4000);
    return () => window.clearInterval(t);
  }, [socket, conn, agentReady, reloadAgentData]);

  useEffect(() => {
    if (!socket) return;
    void (async () => {
      try {
        const raw = await portalRequest('list_monitors_json');
        const rows = parseJson<ScreenMonitorRow[]>(raw);
        if (!Array.isArray(rows) || rows.length === 0) return;
        setMonitorOptions(rows);
        if (rows.length >= 2 && !autoMonitorPickDone.current) {
          autoMonitorPickDone.current = true;
          setScreenMonitor(2);
        } else {
          setScreenMonitor((m) => (rows.some((r) => r.index === m) ? m : rows[0]!.index));
        }
      } catch {
        /* agent older than list_monitors_json — keep 1..4 UI */
      }
    })();
  }, [socket, portalRequest]);

  useEffect(() => {
    if (!socket) return;
    const onSockErr = (e: Error) => {
      setScreenHint((prev) => prev ?? `Socket error: ${e.message}`);
    };
    socket.on('connect_error', onSockErr);
    return () => {
      socket.off('connect_error', onSockErr);
    };
  }, [socket]);

  useEffect(() => {
    const onFs = () => {
      setScreenFullscreen(document.fullscreenElement === screenViewerRef.current);
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleScreenFullscreen = useCallback(async () => {
    const el = screenViewerRef.current;
    if (!el || typeof document === 'undefined') return;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch (e) {
      setScreenHint(e instanceof Error ? e.message : 'Full screen blocked (browser / gesture).');
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onFrame = (body: {
      base64?: string;
      left?: number;
      top?: number;
      width?: number;
      height?: number;
      seq?: number;
    }) => {
      const raw = body?.base64;
      if (raw == null || raw === '') return;
      const b64 = String(raw).replace(/\s+/g, '');
      if (!b64) return;
      lastFrameSeq.current = Number(body.seq ?? lastFrameSeq.current + 1);
      gotLiveFrame.current = true;
      liveNoFrameNotified.current = false;
      setScreenSrc(`data:image/jpeg;base64,${b64}`);
      setScreenMeta({
        left: Number(body.left ?? 0),
        top: Number(body.top ?? 0),
        width: Number(body.width ?? 0),
        height: Number(body.height ?? 0),
      });
    };
    if (liveDesktop) {
      lastFrameSeq.current = 0;
      gotLiveFrame.current = false;
      liveNoFrameNotified.current = false;
      socket.on('screen:frame', onFrame);
      void (async () => {
        try {
          const dbg = await portalRequest('screen_debug', { monitor: screenMonitorRef.current });
          const j = parseJson<{
            hasMss?: boolean;
            hasPillow?: boolean;
            captureOk?: boolean;
            captureError?: string;
            jpegChars?: number;
            monitor?: number;
          }>(dbg);
          setScreenHint(
            `Screen check: mss=${String(j.hasMss)} pillow=${String(j.hasPillow)} capture=${String(j.captureOk)} mon=${String(j.monitor ?? screenMonitorRef.current)} ` +
            (j.captureError ? `err=${j.captureError} ` : '') +
            (j.jpegChars != null ? `jpeg~${j.jpegChars} chars` : ''),
          );
        } catch (e) {
          setScreenHint(e instanceof Error ? e.message : String(e));
        }
      })();
      setTimeout(() => {
        void captureScreen({ preserveHint: true });
      }, 200);
      liveWatchdog.current = setInterval(() => {
        if (!gotLiveFrame.current && !liveNoFrameNotified.current) {
          liveNoFrameNotified.current = true;
          setScreenHint(
            (h) =>
              `${h ?? ''} | No live frames yet — check agent (mss/Pillow) and API.`,
          );
        }
      }, 7000);
      return () => {
        if (liveWatchdog.current) {
          clearInterval(liveWatchdog.current);
          liveWatchdog.current = null;
        }
        socket.emit('screen:control', { action: 'stop' });
        socket.off('screen:frame', onFrame);
      };
    }
    return undefined;
  }, [socket, liveDesktop, portalRequest, captureScreen]);

  useEffect(() => {
    if (!socket?.connected || !liveDesktop) return;
    socket.emit('screen:control', { action: 'start', fps: 4, monitor: screenMonitor });
  }, [socket, liveDesktop, screenMonitor]);

  const breadcrumb = useMemo(() => {
    if (!path.trim()) return [];
    const p = path.replace(/[/\\]+$/, '');
    const parts = p.split(/\\+/).filter(Boolean);
    const out: { label: string; full: string }[] = [];
    let acc = parts[0]?.endsWith(':') ? `${parts[0]}\\` : '';
    const startIdx = parts[0]?.endsWith(':') ? 1 : 0;
    if (parts[0]?.endsWith(':')) {
      out.push({ label: parts[0], full: acc });
    }
    for (let i = startIdx; i < parts.length; i++) {
      acc = `${acc}${parts[i]}\\`;
      out.push({ label: parts[i], full: acc });
    }
    return out;
  }, [path]);

  const filteredInstalled = useMemo(() => {
    const q = appQuery.trim().toLowerCase();
    if (!q) return installed;
    return installed.filter((a) => (a.name || '').toLowerCase().includes(q));
  }, [installed, appQuery]);

  const filteredStart = useMemo(() => {
    const q = appQuery.trim().toLowerCase();
    if (!q) return startMenu;
    return startMenu.filter((a) => (a.name || '').toLowerCase().includes(q));
  }, [startMenu, appQuery]);

  const filteredEntries = useMemo(() => {
    if (!path.trim()) return [];
    const q = appQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [path, entries, appQuery]);

  const drivesEmpty = drives.length === 0;

  const onScreenClick = useCallback(
    async (e: React.MouseEvent<HTMLImageElement>) => {
      if (!screenMeta) return;
      const img = e.currentTarget;
      const rect = img.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * img.naturalWidth;
      const ny = ((e.clientY - rect.top) / rect.height) * img.naturalHeight;
      try {
        const msg = await portalRequest('screen_click_focus', {
          x: nx,
          y: ny,
          vw: img.naturalWidth,
          vh: img.naturalHeight,
          left: screenMeta.left,
          top: screenMeta.top,
          width: screenMeta.width,
          height: screenMeta.height,
        });
        setScreenHint(String(msg));
      } catch (err) {
        setScreenHint(err instanceof Error ? err.message : String(err));
      }
    },
    [portalRequest, screenMeta],
  );

  const runSidePortal = useCallback(
    async (type: string, payload?: Record<string, unknown>) => {
      setSideLog('…');
      try {
        const raw = await portalRequest(type, payload);
        setSideLog(String(raw).slice(0, 16000));
      } catch (e) {
        setSideLog(e instanceof Error ? e.message : String(e));
      }
    },
    [portalRequest],
  );

  useEffect(() => {
    const tick = () => {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      if (perf.memory) setTabHeapMb(Math.round(perf.memory.usedJSHeapSize / 1024 / 1024));
    };
    tick();
    const id = window.setInterval(tick, 4000);
    return () => window.clearInterval(id);
  }, []);

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  const renderSidebarNav = (opts: { compact: boolean; onPick?: () => void }) => {
    const { compact, onPick } = opts;
    const pick = () => {
      onPick?.();
    };
    const navBtn = (active: boolean, extra: string) =>
      `${compact ? 'flex h-10 w-10 items-center justify-center rounded-lg p-0' : 'cyber-nav-btn'} ${active ? 'cyber-nav-btn-active border-cyan-400/45' : ''} ${extra}`;
    return (
      <div className={`cyber-panel flex flex-col ${compact ? 'items-center gap-1 p-1.5' : 'gap-1 p-2'}`}>
        {!compact ? (
          <p className="border-b border-cyan-500/25 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90">
            Console
          </p>
        ) : null}
        <button
          type="button"
          title="Dashboard"
          className={navBtn(leftTab === 'dashboard', 'text-cyan-100/85')}
          onClick={() => {
            setLeftTab('dashboard');
            pick();
          }}
        >
          {compact ? <LayoutGrid className="h-4 w-4 text-cyan-200" /> : 'Dashboard'}
        </button>
        <button
          type="button"
          title="Drives / Explorer"
          className={navBtn(leftTab === 'explorer', 'text-cyan-100/85')}
          onClick={() => {
            setLeftTab('explorer');
            pick();
          }}
        >
          {compact ? <FolderOpen className="h-4 w-4 text-cyan-200" /> : 'Drives / Explorer'}
        </button>
        <button
          type="button"
          title="Programs"
          className={navBtn(leftTab === 'apps', 'text-cyan-100/85')}
          onClick={() => {
            setLeftTab('apps');
            pick();
          }}
        >
          {compact ? <LayoutGrid className="h-4 w-4 text-cyan-200" /> : 'Programs'}
        </button>
        <button
          type="button"
          title="Desktop stream"
          className={navBtn(leftTab === 'screen', 'text-cyan-100/85')}
          onClick={() => {
            setLeftTab('screen');
            pick();
          }}
        >
          {compact ? <MonitorDot className="h-4 w-4 text-cyan-200" /> : 'Desktop stream'}
        </button>
        <button
          type="button"
          title="Quick tools"
          className={navBtn(leftTab === 'tools', 'text-cyan-100/85')}
          onClick={() => {
            setLeftTab('tools');
            pick();
          }}
        >
          {compact ? <Wrench className="h-4 w-4 text-cyan-200" /> : 'Quick tools'}
        </button>
        <button
          type="button"
          title="Terminal workspace"
          className={navBtn(false, 'mt-1 border border-cyan-800/50 text-cyan-200/90 hover:border-cyan-500/40')}
          onClick={() => {
            setTerminalFocus(true);
            setMobileNavOpen(false);
            pick();
          }}
        >
          {compact ? <TerminalIcon className="h-4 w-4" /> : 'Terminal workspace'}
        </button>
      </div>
    );
  };

  const renderOpsPanel = (opts: { compact: boolean }) => {
    if (opts.compact) {
      return (
        <div className="cyber-panel flex flex-col items-center p-1.5">
          <button
            type="button"
            title="Ops: open quick tools tab"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-800/40 text-emerald-200/90 hover:border-emerald-500/40"
            onClick={() => {
              if (terminalFocus) {
                setTerminalFocus(false);
              }
              setLeftTab('tools');
            }}
          >
            <Wrench className="h-4 w-4" />
          </button>
        </div>
      );
    }
    return (
      <div className="cyber-panel flex max-h-[55vh] min-h-0 flex-1 flex-col gap-1 overflow-hidden p-2">
        <p className="border-b border-emerald-500/25 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
          Ops
        </p>
        <div className="cyber-scroll flex max-h-[42vh] flex-col gap-1 overflow-y-auto pr-1">
          {(
            [
              ['query_user_sessions', 'Users / sessions (query)'],
              ['process_list_brief', 'Processes'],
              ['services_brief', 'Services'],
              ['startup_entries', 'Startup (Run keys)'],
              ['net_share_list', 'Shares (net)'],
              ['firewall_profiles', 'Firewall profiles'],
              ['network_info', 'Network (ipconfig)'],
              ['logs_tail', 'Event log (sample)'],
              ['tasks_list', 'Scheduled tasks'],
              ['diskpart_list_disk', 'Diskpart list disk'],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              type="button"
              className="cyber-nav-btn py-1.5 text-[10px] leading-tight text-emerald-200/85"
              onClick={() => {
                if (terminalFocus) {
                  setTerminalFocus(false);
                }
                void runSidePortal(t);
              }}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="cyber-nav-btn py-1.5 text-[10px] text-cyan-200/90"
            onClick={() => {
              if (terminalFocus) {
                setTerminalFocus(false);
              }
              void runSidePortal('open_mmc', { name: 'devmgmt.msc' });
            }}
          >
            Device Manager
          </button>
        </div>
        {sideLog ? (
          <pre className="cyber-scroll mt-1 max-h-40 shrink-0 overflow-auto rounded-lg border border-emerald-500/20 bg-black/70 p-2 text-[9px] leading-snug text-emerald-100/90">
            {sideLog}
          </pre>
        ) : null}
      </div>
    );
  };

  const sidebarPad = sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-52';

  return (
    <div
      className={`relative z-[3] flex w-full flex-col ${terminalFocus ? 'h-dvh min-h-0 overflow-hidden' : 'min-h-full'}`}
    >
      <div className="pointer-events-none fixed inset-0 z-[2] matrix-scanlines opacity-[0.06]" aria-hidden />

      <header className="fixed top-0 right-0 left-0 z-[500] flex h-14 items-center gap-2 border-b border-cyan-500/20 bg-zinc-950/45 px-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl md:gap-3 md:px-4">
        <button
          type="button"
          className="rounded-lg border border-cyan-800/50 p-2 text-cyan-200 hover:border-cyan-500/40 lg:hidden"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen((v) => !v)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="hidden bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-sm font-bold tracking-tight text-transparent sm:inline">
          NEXUS INTELLIGENCE
        </span>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${conn === 'open'
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(74,222,128,0.2)]'
            : conn === 'connecting'
              ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
              : 'border-rose-500/35 bg-rose-950/40 text-rose-200/90'
            }`}
        >
          {conn === 'open' ? 'Online' : conn === 'connecting' ? 'Connecting' : 'Offline'}
        </span>
        <span className="hidden min-w-0 truncate text-[10px] text-cyan-700/95 md:inline lg:max-w-[14rem]">
          {shellTab === 'powershell' ? 'PS' : 'CMD'} · {accountLine ?? '—'}
        </span>
        <input
          value={appQuery}
          onChange={(e) => setAppQuery(e.target.value)}
          placeholder="Search files & apps…"
          className="cyber-input ml-auto min-w-0 max-w-[11rem] flex-1 py-1.5 text-xs sm:max-w-xs"
          aria-label="Search files and applications"
        />
        <button
          type="button"
          title={terminalFocus ? 'Show full dashboard' : 'Terminal fills workspace'}
          className={`cyber-btn shrink-0 px-2 py-1.5 ${terminalFocus
            ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
            : 'border-cyan-600/40'
            }`}
          onClick={() => setTerminalFocus((v) => !v)}
        >
          {terminalFocus ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
        <button
          type="button"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="cyber-btn cyber-btn-ghost hidden shrink-0 px-2 py-1.5 lg:inline-flex"
          onClick={() => setSidebarCollapsed((c) => !c)}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <span className="hidden shrink-0 text-[9px] text-cyan-800/90 xl:inline" title="Browser tab JS heap (approx.)">
          RAM ~{tabHeapMb != null ? `${tabHeapMb} MB` : '—'}
        </span>
      </header>

      {mobileNavOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[498] bg-black/55 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
            onClick={closeMobileNav}
          />
          <aside className="fixed top-14 bottom-0 left-0 z-[499] flex w-56 flex-col gap-2 overflow-y-auto border-r border-cyan-900/35 bg-black/92 p-2 shadow-2xl lg:hidden">
            {renderSidebarNav({ compact: false, onPick: closeMobileNav })}
            {renderOpsPanel({ compact: false })}
          </aside>
        </>
      ) : null}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-[490] hidden flex-col gap-2 border-r border-cyan-900/30 bg-black/75 py-2 shadow-[8px_0_40px_rgba(0,0,0,0.45)] backdrop-blur-lg transition-[width] duration-300 ease-out lg:flex ${sidebarCollapsed ? 'w-16 overflow-hidden' : 'w-52 px-2'
          }`}
      >
        {renderSidebarNav({ compact: sidebarCollapsed })}
        {renderOpsPanel({ compact: sidebarCollapsed })}
      </aside>

      <div className={`relative flex min-h-0 flex-1 flex-col ${sidebarPad} pt-14`}>
        {!terminalFocus ? (
          <div className="mx-auto flex w-full max-w-[1920px] min-w-0 flex-1 flex-col gap-4 px-3 pb-8 pt-4 md:px-5">
            {/* <div className="cyber-header text-xs leading-relaxed text-cyan-100/70 md:text-sm">
              Unified <strong className="text-cyan-300/95">AI control system</strong> for real-time automation, analysis, and command execution.
            </div> */}

            <div className="grid flex-1 grid-cols-1 items-stretch gap-4 min-h-[calc(100dvh-9rem)] lg:min-h-[calc(100dvh-8.5rem)] lg:grid-cols-12">
              <section className="flex min-h-0 flex-col gap-3 lg:col-span-12">
                <Tabs.Root
                  value={leftTab}
                  onValueChange={(v) => setLeftTab(v as 'explorer' | 'apps' | 'screen' | 'tools' | 'dashboard')}
                  className="cyber-panel flex min-h-[min(480px,calc(100dvh-10rem))] flex-1 flex-col overflow-hidden"
                >
                  <Tabs.List className="flex shrink-0 flex-wrap gap-1 border-b border-cyan-500/20 bg-black/40 p-1 lg:hidden">
                    {(['dashboard', 'explorer', 'apps', 'screen', 'tools'] as const).map((v) => (
                      <Tabs.Trigger
                        key={v}
                        value={v}
                        className="min-w-0 flex-1 rounded-md px-2 py-2 text-xs font-medium text-cyan-200/50 transition-colors data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-50 data-[state=active]:shadow-[0_0_16px_rgba(0,240,255,0.12)] md:px-3 md:text-sm"
                      >
                        {v === 'dashboard'
                          ? 'Dashboard'
                          : v === 'explorer'
                            ? 'Drives & files'
                            : v === 'apps'
                              ? 'Programs'
                              : v === 'screen'
                                ? 'Desktop view'
                                : 'Quick tools'}
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>

                  <Tabs.Content value="dashboard" className="flex flex-1 flex-col p-3">
                    <Dashboard />
                  </Tabs.Content>

                  <Tabs.Content value="explorer" className="flex min-h-0 flex-1 flex-col gap-2 p-3">
                    <div className={`flex min-h-0 flex-1 flex-col gap-3 ${drivesEmpty ? '' : 'lg:flex-row'}`}>
                      {!drivesEmpty ? (
                        <aside
                          className="flex shrink-0 flex-col gap-2 overflow-x-auto pb-1 lg:w-48 lg:min-w-[11rem] lg:flex-shrink-0 lg:overflow-y-auto lg:pb-0 lg:pr-1"
                          aria-label="Drives"
                        >
                          <div className="flex items-center justify-between gap-2 px-0.5">
                            <p className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-600/90 lg:block">
                              This PC
                            </p>
                            <button
                              type="button"
                              onClick={() => void refreshDrives()}
                              className="cyber-btn shrink-0 px-2 py-1 text-[10px] lg:px-1.5"
                              title="Reload drive list"
                            >
                              Refresh
                            </button>
                          </div>
                          {path.trim() ? (
                            <button
                              type="button"
                              onClick={() => {
                                const parent = explorerParentPath(path);
                                if (parent == null) {
                                  setPath('');
                                  setEntries([]);
                                  setExplorerError(null);
                                  setDirLoading(false);
                                } else {
                                  void refreshDir(parent);
                                }
                              }}
                              className="cyber-btn cyber-btn-ghost w-full px-2 py-1.5 text-left text-[10px] lg:text-xs"
                            >
                              ← Back
                            </button>
                          ) : null}
                          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-x-visible lg:gap-1.5">
                            {drives.map((d) => {
                              const root = d.path.replace(/[/\\]+$/, '').toUpperCase();
                              const cur = path.replace(/[/\\]+$/, '').toUpperCase();
                              const active = cur === root || cur.startsWith(`${root}\\`);
                              return (
                                <button
                                  key={d.letter}
                                  type="button"
                                  title={d.path}
                                  onClick={() => {
                                    const rootPath = d.path.replace(/[/\\]+$/, '');
                                    setPath(`${rootPath}\\`);
                                    setEntries([]);
                                    setExplorerError(null);
                                    void refreshDir(d.path);
                                  }}
                                  className={`flex min-w-[6.5rem] flex-col items-start gap-0.5 rounded-xl border px-2.5 py-2 text-left transition-all lg:min-w-0 lg:w-full ${active
                                    ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-50 shadow-[0_0_16px_rgba(0,240,255,0.14)] ring-1 ring-cyan-400/25'
                                    : 'border-cyan-900/40 bg-black/20 text-cyan-100/90 hover:border-cyan-500/45 hover:bg-cyan-500/5'
                                    }`}
                                >
                                  <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-tight">
                                    <HardDrive className="h-3.5 w-3.5 shrink-0 text-cyan-400/90" aria-hidden />
                                    {d.letter}: <span className="font-normal text-cyan-700/90">Local Disk</span>
                                  </span>
                                  {d.freeGb != null ? (
                                    <span className="pl-5 text-[10px] text-zinc-500">{d.freeGb} GB free</span>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </aside>
                      ) : null}
                      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                        {!path.trim() ? (
                          <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border border-cyan-900/25 bg-black/20 px-4 py-8 text-center">
                            {drivesEmpty ? (
                              <>
                                {explorerError ? (
                                  <p className="mb-2 max-w-md text-xs text-rose-400">{explorerError}</p>
                                ) : null}
                                <p className="max-w-[18rem] text-xs leading-relaxed text-cyan-700/90">
                                  {agentReady
                                    ? 'No drives from agent — click Retry or check the agent console.'
                                    : 'Start agent on this PC: py src\\main.py --api http://52.62.136.167:4000'}
                                </p>
                                <button type="button" onClick={() => void reloadAgentData()} className="cyber-btn mt-4 text-xs">
                                  Retry drives
                                </button>
                              </>
                            ) : (
                              <p className="max-w-[15rem] text-xs leading-relaxed text-cyan-700/90">
                                Select a drive on the left to browse folders and files.
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
                            {dirLoading && !explorerError && entries.length === 0 ? (
                              <p className="shrink-0 text-[11px] text-cyan-600/90">Loading directory…</p>
                            ) : null}
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const parent = explorerParentPath(path);
                                  if (parent == null) {
                                    setPath('');
                                    setEntries([]);
                                    setExplorerError(null);
                                    setDirLoading(false);
                                  } else {
                                    void refreshDir(parent);
                                  }
                                }}
                                className="cyber-btn cyber-btn-ghost"
                              >
                                ← Back
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPath('');
                                  setEntries([]);
                                  setExplorerError(null);
                                  setDirLoading(false);
                                }}
                                className="cyber-btn cyber-btn-ghost"
                              >
                                All drives
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  void refreshDrives();
                                  void refreshDir(path);
                                }}
                                className="cyber-btn"
                              >
                                Refresh
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await portalRequest('launch_path', { path });
                                    setScreenHint(`Opened folder: ${path}`);
                                  } catch (e) {
                                    setScreenHint(e instanceof Error ? e.message : String(e));
                                  }
                                }}
                                className="cyber-btn cyber-btn-emerald"
                              >
                                Open in Windows
                              </button>
                            </div>
                            <nav className="flex min-h-[2rem] flex-wrap items-center gap-1 rounded-lg border border-cyan-900/25 bg-black/15 px-2 py-1.5 text-xs text-cyan-800/90">
                              {breadcrumb.map((b, i) => (
                                <span key={b.full} className="flex items-center gap-1">
                                  {i > 0 ? <span className="text-cyan-900">\</span> : null}
                                  <button
                                    type="button"
                                    className="rounded px-0.5 text-cyan-200/85 transition-colors duration-150 hover:text-cyan-50 hover:underline"
                                    onClick={() => void refreshDir(b.full)}
                                  >
                                    {b.label}
                                  </button>
                                </span>
                              ))}
                            </nav>
                            {explorerError ? (
                              <p className="text-xs text-rose-400">{explorerError}</p>
                            ) : null}
                            <div className="cyber-scroll min-h-0 flex-1 overflow-auto rounded-lg border border-cyan-900/30 bg-black/10">
                              <ul className="divide-y divide-cyan-950/50">
                                {filteredEntries.map((e) => (
                                  <li key={e.name}>
                                    <button
                                      type="button"
                                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-cyan-50/90 transition-colors duration-150 hover:bg-cyan-500/5"
                                      onDoubleClick={() => {
                                        const next = `${path.replace(/[/\\]+$/, '')}\\${e.name}`;
                                        if (e.isDir) void refreshDir(next);
                                      }}
                                      onClick={() => {
                                        const full = `${path.replace(/[/\\]+$/, '')}\\${e.name}`;
                                        if (!e.isDir && /\.(exe|bat|cmd|msi)$/i.test(e.name)) {
                                          void portalRequest('launch_path', { path: full }).catch(() => { });
                                        }
                                      }}
                                    >
                                      <span className="truncate text-cyan-50/95">
                                        {e.isDir ? '[DIR] ' : ''}
                                        {e.name}
                                      </span>
                                      {e.size != null && !e.isDir ? (
                                        <span className="shrink-0 pl-2 text-[10px] text-cyan-700/90">
                                          {(e.size / 1024).toFixed(0)} KB
                                        </span>
                                      ) : null}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="text-[10px] leading-relaxed text-cyan-900/80">
                              Double-click a folder to open. Click an <code className="text-cyan-600/90">.exe</code> to launch
                              on the agent.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="apps" className="flex flex-1 flex-col gap-2 p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAppsTab('installed')}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition-all duration-200 ${appsTab === 'installed' ? 'cyber-pill-active ring-emerald-500/30' : 'cyber-pill-idle'
                          }`}
                      >
                        Installed
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppsTab('start')}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition-all duration-200 ${appsTab === 'start' ? 'cyber-pill-active ring-emerald-500/30' : 'cyber-pill-idle'
                          }`}
                      >
                        Start menu
                      </button>
                      <button
                        type="button"
                        onClick={() => void refreshApps()}
                        className="cyber-btn ml-auto"
                      >
                        Reload
                      </button>
                    </div>
                    <p className="text-[10px] text-cyan-800/90">Filter with the header search bar.</p>
                    <div className="cyber-scroll min-h-0 flex-1 overflow-auto rounded-lg border border-cyan-900/35 bg-black/30">
                      <ul className="divide-y divide-cyan-950/50">
                        {(appsTab === 'installed' ? filteredInstalled : filteredStart).map((a, idx) => (
                          <li key={`${a.name}-${idx}`} className="flex items-center gap-2 px-3 py-2 text-sm">
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium text-cyan-50/95">{a.name}</div>
                              <div className="truncate text-[11px] text-cyan-800/90">
                                {appsTab === 'installed' ? a.location || a.version : a.path}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="cyber-btn shrink-0 px-2 py-1 text-[11px]"
                              onClick={() => {
                                const target =
                                  appsTab === 'start'
                                    ? String(a.path || '')
                                    : String(a.location || '').trim();
                                if (!target) return;
                                void portalRequest('launch_path', { path: target }).catch(() => { });
                              }}
                            >
                              Open
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="tools" className="flex min-h-0 flex-1 flex-col">
                    <QuickToolsPanel socket={socket} conn={conn} />
                  </Tabs.Content>

                  <Tabs.Content value="screen" className="flex min-h-0 flex-1 flex-col gap-3 p-3">
                    <div
                      ref={screenViewerRef}
                      className={`flex min-h-[min(320px,calc(100dvh-18rem))] flex-1 flex-col gap-3 ${screenFullscreen ? 'box-border h-full bg-black/50 p-2' : ''}`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setLiveDesktop((v) => {
                              const next = !v;
                              setScreenHint(next ? 'Live stream starting…' : 'Live stopped.');
                              return next;
                            });
                          }}
                          className={`cyber-btn ${liveDesktop ? 'cyber-btn-emerald' : ''}`}
                        >
                          {liveDesktop ? 'Stop live' : 'Live desktop'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void captureScreen()}
                          disabled={liveDesktop}
                          className="cyber-btn cyber-btn-ghost disabled:pointer-events-none"
                        >
                          Snapshot
                        </button>
                        <button type="button" onClick={() => void toggleScreenFullscreen()} className="cyber-btn cyber-btn-ghost">
                          {screenFullscreen ? 'Exit full screen' : 'Full screen'}
                        </button>
                        <label className="ml-auto flex items-center gap-2 text-[11px] text-cyan-800/95">
                          <span className="shrink-0">Display</span>
                          <select
                            value={screenMonitor}
                            onChange={(e) => setScreenMonitor(Number(e.target.value) || 1)}
                            className="cyber-input max-w-[11rem] py-1 text-xs"
                          >
                            {monitorOptions.map((m) => (
                              <option key={m.index} value={m.index}>
                                {m.label}
                                {m.width > 0 ? ` (${m.width}×${m.height})` : ''}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      {screenHint ? <p className="text-xs leading-snug text-cyan-700/90">{screenHint}</p> : null}
                      {screenSrc ? (
                        <div
                          className={`relative flex min-h-0 w-full flex-1 overflow-hidden rounded-lg border border-cyan-900/35 bg-black/15 ${screenFullscreen
                            ? 'min-h-0 max-h-[calc(100dvh-9rem)] flex-1 sm:max-h-[calc(100dvh-7rem)]'
                            : 'min-h-[min(360px,calc(100dvh-20rem))] flex-1'
                            }`}
                        >
                          <img
                            src={screenSrc}
                            alt="Desktop snapshot"
                            className="mx-auto block h-full w-full max-h-full cursor-crosshair object-contain"
                            onClick={onScreenClick}
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-3 pb-2 pt-10 text-left text-[10px] leading-snug text-cyan-200/80">
                            Same-screen tunnel effect is normal — switch display or use another device.
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`flex flex-1 items-center justify-center rounded-lg border border-dashed border-cyan-900/40 px-4 text-center text-sm text-cyan-800/90 ${screenFullscreen ? 'min-h-[40vh]' : 'min-h-[min(200px,calc(100dvh-22rem))]'
                            }`}
                        >
                          {liveDesktop
                            ? 'Waiting for frames… check agent (mss/Pillow) and API.'
                            : 'Start live or take a snapshot — click image to focus a window.'}
                        </div>
                      )}
                    </div>
                  </Tabs.Content>
                </Tabs.Root>
              </section>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 px-2 pb-3 pt-2 md:px-4">
            <div className="cyber-panel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-3">
              <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setTerminalFocus(false)}
                  className="cyber-btn cyber-btn-ghost flex items-center gap-1 px-3 py-1.5 text-xs font-semibold md:text-sm"
                >
                  ← Back to Dashboard
                </button>
                <p className="text-[10px] text-cyan-600/75">Terminal workspace</p>
              </div>
              {accountLine ? (
                <p className="mb-1 shrink-0 bg-gradient-to-r from-cyan-200 to-emerald-200 bg-clip-text text-[12px] font-semibold text-transparent">
                  {accountLine}
                </p>
              ) : null}
              {machineLine ? (
                <p className="mb-2 shrink-0 text-[10px] leading-snug text-cyan-600/90">{machineLine}</p>
              ) : null}
              <div className="mb-2 flex shrink-0 gap-1 rounded-xl border border-cyan-500/25 bg-black/50 p-1 ring-1 ring-emerald-500/10">
                <button
                  type="button"
                  onClick={() => setShellTab('cmd')}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all md:text-sm ${shellTab === 'cmd'
                    ? 'border border-cyan-400/40 bg-cyan-500/20 text-cyan-50 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                    : 'text-cyan-200/50 hover:text-cyan-100'
                    }`}
                >
                  CMD
                </button>
                <button
                  type="button"
                  onClick={() => setShellTab('powershell')}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all md:text-sm ${shellTab === 'powershell'
                    ? 'border border-emerald-400/40 bg-emerald-500/15 text-emerald-50 shadow-[0_0_20px_rgba(57,255,20,0.12)]'
                    : 'text-emerald-200/50 hover:text-emerald-100'
                    }`}
                >
                  <span className="inline-flex flex-wrap items-center justify-center gap-2">
                    PowerShell
                    {agentElevated ? (
                      <span className="rounded border border-rose-500/50 bg-rose-950/80 px-1.5 text-[9px] font-semibold text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.35)]">
                        [ADMIN]
                      </span>
                    ) : null}
                  </span>
                </button>
              </div>
              <div className="relative flex min-h-0 flex-1 flex-col">
                <TerminalPanel
                  key={shellTab}
                  socket={socket}
                  conn={conn}
                  portalRequest={portalRequest}
                  shell={shellTab === 'cmd' ? 'cmd' : 'powershell'}
                  title={shellTab === 'cmd' ? 'CMD' : 'PowerShell'}
                  accountLine={accountLine}
                  machineLine={machineLine}
                  agentElevated={agentElevated}
                  hideChrome
                  isActive
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
