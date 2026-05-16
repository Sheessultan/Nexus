'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Terminal,
  Shield,
  Zap,
  Network,
  Database,
  Settings,
  Play,
  ChevronRight,
  Lock,
  Activity,
} from 'lucide-react';
import BinaryRain from '@/components/BinaryRain';
import ConsoleDashboard from '@/components/ConsoleDashboard';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showConsole, setShowConsole] = useState(false);

  const quickTools = [
    {
      id: 'terminal',
      label: 'Terminal',
      icon: Terminal,
      desc: 'Interactive shell access',
      color: 'cyan',
    },
    {
      id: 'shield',
      label: 'Security',
      icon: Shield,
      desc: 'System security audit',
      color: 'emerald',
    },
    {
      id: 'zap',
      label: 'Performance',
      icon: Zap,
      desc: 'Real-time metrics',
      color: 'amber',
    },
    {
      id: 'network',
      label: 'Network',
      icon: Network,
      desc: 'Network diagnostics',
      color: 'blue',
    },
    {
      id: 'database',
      label: 'Storage',
      icon: Database,
      desc: 'Disk & storage info',
      color: 'purple',
    },
    {
      id: 'settings',
      label: 'System',
      icon: Settings,
      desc: 'System configuration',
      color: 'rose',
    },
  ];

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return quickTools;
    return quickTools.filter(
      (tool) =>
        tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  if (showConsole) {
    return <ConsoleDashboard />;
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden">
      <BinaryRain />

      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0" />

      {/* Gradient orbs */}
      <div className="fixed top-0 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse z-0" />
      <div className="fixed bottom-0 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse z-0" />

      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] matrix-scanlines opacity-[0.06]" />

      {/* Main content */}
      <div className="relative z-[2] flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-cyan-500/20 backdrop-blur-xl bg-black/40 sticky top-0 z-40 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                    NEXUS INTELLIGENCE
                  </h1>
                </div>
                <p className="text-sm md:text-base text-cyan-200/70 ml-11 font-light tracking-wide">
                  Unified AI control system for real-time automation, analysis, and command execution.
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-300">ONLINE</span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-cyan-500/60" />
              <input
                type="text"
                placeholder="Search tools & capabilities... (terminal, security, network, storage)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-cyan-500/30 rounded-lg text-cyan-50 placeholder:text-cyan-700/60 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
              />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="group p-4 rounded-xl border border-cyan-500/20 bg-black/40 hover:bg-cyan-500/5 transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/80">
                  System Status
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-cyan-200 mb-1">OPERATIONAL</p>
              <p className="text-xs text-cyan-700/80">All systems nominal</p>
            </div>

            <div className="group p-4 rounded-xl border border-emerald-500/20 bg-black/40 hover:bg-emerald-500/5 transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80">
                  Active Sessions
                </span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-200 mb-1">1</p>
              <p className="text-xs text-emerald-700/80">Connected & ready</p>
            </div>

            <div className="group p-4 rounded-xl border border-amber-500/20 bg-black/40 hover:bg-amber-500/5 transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">
                  Network Uptime
                </span>
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-amber-200 mb-1">99.8%</p>
              <p className="text-xs text-amber-700/80">Secure connection</p>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent tracking-tight mb-2">
                Quick Access Tools
              </h2>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const colorClasses = {
                    cyan: 'border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]',
                    emerald:
                      'border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]',
                    amber: 'border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-500/10 hover:shadow-[0_0_20px_rgba(217,119,6,0.1)]',
                    blue: 'border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]',
                    purple:
                      'border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]',
                    rose: 'border-rose-500/30 hover:border-rose-400/60 hover:bg-rose-500/10 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]',
                  };

                  const iconColorClasses = {
                    cyan: 'text-cyan-400',
                    emerald: 'text-emerald-400',
                    amber: 'text-amber-400',
                    blue: 'text-blue-400',
                    purple: 'text-purple-400',
                    rose: 'text-rose-400',
                  };

                  return (
                    <button
                      key={tool.id}
                      onClick={() => setShowConsole(true)}
                      className={`group/card relative p-5 rounded-xl border bg-black/30 transition-all duration-300 text-left overflow-hidden ${colorClasses[tool.color as keyof typeof colorClasses]}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover/card:from-white/5 group-hover/card:to-white/0 transition-all" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg bg-black/50 ${iconColorClasses[tool.color as keyof typeof iconColorClasses]}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">{tool.label}</h3>
                        <p className="text-sm text-cyan-200/60 mb-3">{tool.desc}</p>
                        <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 opacity-0 group-hover/card:opacity-100 transition-opacity">
                          <Play className="w-3 h-3" /> Access tool
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-cyan-500/20 bg-black/30 text-center">
                <p className="text-cyan-700/80 text-sm">
                  No tools match "{searchQuery}". Try another search or clear to see all.
                </p>
              </div>
            )}
          </div>

          {/* Launch Console */}
          <div className="mb-8">
            <button
              onClick={() => setShowConsole(true)}
              className="w-full group relative px-6 py-4 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-white/5 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-white/10 group-hover:to-emerald-500/10 transition-all" />
              <div className="relative flex items-center justify-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span className="text-base font-bold text-emerald-200">
                  Launch Full Console Workspace
                </span>
                <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Footer info */}
          <div className="pt-8 border-t border-cyan-500/10 text-center">
            <p className="text-xs text-cyan-700/70 tracking-wide">
              NEXUS INTELLIGENCE v1.0 • Advanced system control interface • <span className="text-emerald-400">Secured</span>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
