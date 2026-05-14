'use client';

import {
  Terminal,
  Shield,
  Zap,
  Network,
  Database,
  Settings,
  ChevronRight,
  MonitorDot,
  LayoutGrid,
} from 'lucide-react';
import type { ConsoleLeftTab } from '@/types/consoleBoot';

type Props = {
  onOpenTab: (tab: ConsoleLeftTab) => void;
  onOpenTerminal: () => void;
  onRunOps: (type: string, label: string, payload?: Record<string, unknown>) => void;
};

const cards: {
  tab?: ConsoleLeftTab;
  terminal?: boolean;
  ops?: { type: string; label: string; payload?: Record<string, unknown> };
  label: string;
  desc: string;
  icon: typeof Terminal;
  color: string;
}[] = [
  { tab: 'explorer', label: 'Files & drives', desc: 'Browse volumes like This PC', icon: Database, color: 'cyan' },
  { tab: 'apps', label: 'Programs', desc: 'Installed apps & Start menu', icon: LayoutGrid, color: 'emerald' },
  { tab: 'screen', label: 'Desktop view', desc: 'Live stream or snapshot', icon: MonitorDot, color: 'blue' },
  { tab: 'tools', label: 'Quick commands', desc: 'One-shot CMD / PowerShell presets', icon: Zap, color: 'amber' },
  {
    ops: { type: 'network_info', label: 'Network (ipconfig)' },
    label: 'Network diagnostics',
    desc: 'ipconfig and related checks',
    icon: Network,
    color: 'blue',
  },
  {
    ops: { type: 'firewall_profiles', label: 'Firewall profiles' },
    label: 'Security snapshot',
    desc: 'Firewall, shares, startup',
    icon: Shield,
    color: 'emerald',
  },
  {
    ops: { type: 'process_list_brief', label: 'Processes' },
    label: 'Performance',
    desc: 'Top processes & services',
    icon: Zap,
    color: 'amber',
  },
  {
    ops: { type: 'system_info', label: 'System (OS / hardware)' },
    label: 'System info',
    desc: 'OS build and machine summary',
    icon: Settings,
    color: 'rose',
  },
  { terminal: true, label: 'Terminal', desc: 'Interactive CMD / PowerShell', icon: Terminal, color: 'cyan' },
];

export default function ConsoleHomePanel({ onOpenTab, onOpenTerminal, onRunOps }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
      <p className="text-[11px] leading-relaxed text-cyan-800/95">
        In-console home — pick a module. Everything runs on the <strong className="text-cyan-500/90">selected machine</strong>{' '}
        in the header.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const ring =
            c.color === 'cyan'
              ? 'border-cyan-900/40 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]'
              : c.color === 'emerald'
                ? 'border-emerald-900/40 hover:border-emerald-500/45 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                : c.color === 'amber'
                  ? 'border-amber-900/40 hover:border-amber-500/45'
                  : c.color === 'blue'
                    ? 'border-blue-900/40 hover:border-blue-500/45'
                    : 'border-rose-900/40 hover:border-rose-500/45';
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                if (c.terminal) onOpenTerminal();
                else if (c.ops) onRunOps(c.ops.type, c.ops.label, c.ops.payload);
                else if (c.tab) onOpenTab(c.tab);
              }}
              className={`group flex flex-col items-start gap-1 rounded-xl border bg-zinc-950/70 p-3 text-left transition-all ${ring}`}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <Icon className="h-4 w-4 shrink-0 text-cyan-400/90" aria-hidden />
                <ChevronRight className="h-4 w-4 shrink-0 text-cyan-700/50 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <span className="text-sm font-semibold text-cyan-50/95">{c.label}</span>
              <span className="text-[11px] leading-snug text-cyan-800/90">{c.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
