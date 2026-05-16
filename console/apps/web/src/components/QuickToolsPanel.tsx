'use client';

import type { Socket } from 'socket.io-client';
import type { ConnState } from '@/hooks/useConsoleSocket';
import { WINDOWS_QUICK_TOOL_GROUPS } from '@/data/windowsQuickTools';

export default function QuickToolsPanel({
  socket,
  conn,
}: {
  socket: Socket | null;
  conn: ConnState;
}) {
  const run = (shell: 'cmd' | 'powershell', command: string) => {
    if (!socket?.connected) return;
    const line = command.replace(/\r?\n$/, '');
    if (!line.trim()) return;
    socket.emit('terminal:input', { data: `${line}\n`, shell, force: true });
  };

  return (
    <div className="cyber-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-3">
      <p className="text-[11px] leading-relaxed text-cyan-800/90">
        One-shot commands on the agent (<strong className="text-cyan-600/95">force</strong> flush). Admin-only tools need
        an elevated agent.
      </p>
      {!socket?.connected ? (
        <p className="text-xs text-cyan-600/90">Waiting for socket…</p>
      ) : null}
      {WINDOWS_QUICK_TOOL_GROUPS.map((g) => (
        <div
          key={g.title}
          className="rounded-xl border border-cyan-900/35 bg-black/35 p-2 ring-1 ring-cyan-500/10 transition-shadow duration-200 hover:shadow-[0_0_20px_rgba(0,240,255,0.06)]"
        >
          <h4 className="mb-2 border-b border-cyan-950/60 pb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-400/90">
            {g.title}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {g.tools.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={conn !== 'open' || !socket?.connected}
                title={t.command}
                onClick={() => run(t.shell, t.command)}
                className="max-w-full truncate rounded-lg border border-cyan-900/40 bg-black/40 px-2 py-1 text-left text-[11px] font-medium text-cyan-100/90 ring-1 ring-transparent transition-all duration-200 hover:border-cyan-500/45 hover:shadow-[0_0_12px_rgba(0,240,255,0.1)] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span className="font-mono text-[9px] uppercase text-emerald-400/90">
                  {t.shell === 'cmd' ? 'CMD' : 'PS'}
                </span>{' '}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
