export type ConsoleLeftTab =
  | 'dashboard'
  | 'explorer'
  | 'apps'
  | 'screen'
  | 'tools'
  | 'operations';

/** How to open the full console from the landing dashboard. */
export type ConsoleBoot = {
  leftTab?: ConsoleLeftTab;
  terminalFocus?: boolean;
  opsPortal?: { type: string; label: string; payload?: Record<string, unknown> };
};
