/** Portal types handled by the Windows agent — used by Ops sidebar and Operations tab. */
export type OpsPortalAction = {
  type: string;
  label: string;
  payload?: Record<string, unknown>;
};

export const OPS_PORTAL_ACTIONS: readonly OpsPortalAction[] = [
  { type: 'query_user_sessions', label: 'Users / sessions (query)' },
  { type: 'process_list_brief', label: 'Processes' },
  { type: 'services_brief', label: 'Services' },
  { type: 'startup_entries', label: 'Startup (Run keys)' },
  { type: 'net_share_list', label: 'Shares (net)' },
  { type: 'firewall_profiles', label: 'Firewall profiles' },
  { type: 'network_info', label: 'Network (ipconfig)' },
  { type: 'logs_tail', label: 'Event log (sample)' },
  { type: 'tasks_list', label: 'Scheduled tasks' },
  { type: 'diskpart_list_disk', label: 'Diskpart list disk' },
  { type: 'system_info', label: 'System (OS / hardware)' },
  { type: 'open_mmc', label: 'Device Manager', payload: { name: 'devmgmt.msc' } },
] as const;
