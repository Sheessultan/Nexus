# API reference — NEXUS INTELLIGENCE

Base URLs (local dev):

| Service | URL |
|---------|-----|
| **REST (NestJS)** | `http://localhost:4000` |
| **Socket.IO namespace** | `http://localhost:4000/console` |
| **Next.js UI** | `http://localhost:3000` |

Environment for the web app:

- `apps/web/.env.local` → `NEXT_PUBLIC_SOCKET_URL=http://localhost:4000/console`

---

## REST (HTTP)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | Health stub |
| `GET` | `/health` | No | `{ status, uptime }` |
| `POST` | `/auth/login` | No | Body `{ username, password }` → JWT |
| `GET` | `/me` | Bearer JWT | Current user payload |

**Where to add new REST APIs:** `apps/api/src/` — create a module with `@Controller('your-path')` and register it in `app.module.ts`.

Suggested future routes (not implemented yet):

- `POST /ai/chat` — proxy to OpenAI / Anthropic / local LLM
- `POST /ai/search` — unified search used by the **Search** tab
- `GET /files` — optional HTTP mirror of file listing (today: Socket `portal:request` only)

---

## WebSocket / Socket.IO (`/console`)

Used by the **browser** and the **Windows agent** on the same namespace.

### From browser (UI)

| Event (emit) | Payload | Description |
|----------------|-----------|-------------|
| `pty:start` | `{ sessionId: string, shell: "cmd" \| "powershell" \| "powershell_admin", rows: number, cols: number }` | Open an interactive **ConPTY** session on the agent (`pywinpty`). |
| `pty:input` | `{ sessionId: string, data: string }` | Raw keystrokes / pasted text to the PTY. |
| `pty:resize` | `{ sessionId: string, rows: number, cols: number }` | Terminal size (after xterm fit). |
| `pty:close` | `{ sessionId: string }` | Tear down that PTY on the agent. |
| `terminal:input` | `{ data: string, shell?: "powershell" \| "cmd", force?: boolean }` | Legacy / Quick tools: optional **`force: true`** runs immediately as one block (skips multi-line buffer). Otherwise PowerShell/CMD lines are **buffered** until the script is syntactically complete, then sent as a single `agent:shell_exec`. |
| `portal:request` | `{ requestId: string, type: string, payload?: object }` | Tool panel calls (desktop, files, …) |
| `screen:control` | `{ action: "start" \| "stop", fps?: number }` | Start/stop live desktop JPEG stream (forwarded to agent; default fps ~5–6) |

| Event (listen) | Payload | Description |
|------------------|-----------|-------------|
| `pty:output` | `{ sessionId?: string, data?: string, error?: string, eof?: boolean, shell?: string }` | ConPTY output stream for the matching `sessionId`. |
| `terminal:output` | `{ data: string, shell?: "powershell" \| "cmd" }` | Legacy shell chunks from `terminal:input` / `agent:shell_exec`. |
| `log:line` | `{ line: string }` | Activity / system messages |
| `portal:result` | `{ requestId, ok, data?, error? }` | Result of `portal:request` |
| `screen:frame` | `{ seq, base64, left, top, width, height, imageWidth?, imageHeight? }` | Live desktop JPEG (stream); server uses large Engine.IO buffer so frames are not dropped |

**Where to add socket handlers:** `apps/api/src/console/console.gateway.ts` — new `@SubscribeMessage('…')` methods.

### From Windows agent (Python)

| Event (emit) | When |
|--------------|------|
| `agent:hello` | On connect |
| `agent:register` | After hello (registers as shell + portal agent) |
| `agent:pty_output` | ConPTY output to a browser client (`clientId`, `sessionId`, `data` \| `error` \| `eof`) |
| `agent:shell_output` | During legacy command run (includes `shell`: `cmd` \| `powershell`) |
| `agent:shell_done` | Command finished (includes `shell`) |
| `agent:portal_response` | After handling `agent:portal_request` |
| `agent:screen_frame` | Live desktop JPEG chunk while stream is on |

| Event (listen) | Description |
|----------------|---------------|
| `agent:pty_start` | `{ clientId, sessionId, shell, rows, cols }` — spawn ConPTY (CMD / PowerShell / admin tab). |
| `agent:pty_input` | `{ clientId, sessionId, data }` |
| `agent:pty_resize` | `{ clientId, sessionId, rows, cols }` |
| `agent:pty_close` | `{ clientId, sessionId }` |
| `agent:pty_client_gone` | `{ clientId }` — browser disconnected; close all PTYs for that client. |
| `agent:shell_exec` | Run PowerShell/CMD line (legacy) |
| `agent:portal_request` | Run portal tool (`system_info`, `list_apps`, …) |
| `agent:screen_control` | `{ action: "start" \| "stop", fps?: number }` — start/stop live capture loop |

**Where to add agent behaviour:** `agent/src/main.py` — extend `handle_portal` or add new `@sio.on` handlers.

### Portal `type` values (today)

| `type` | `payload` | Agent behaviour |
|--------|-----------|-------------------|
| `windows_shell_banner` | `{ shell?: "cmd" \| "powershell" }` | Windows-style header; PS adds PowerShell copyright block; both append session line. |
| `session_info` | — | JSON `whoami`, `userName`, `userDomain`, `host`, `home`, `isElevated` (admin agent). |
| `list_drives` | — | JSON array of `{ letter, path, freeGb }` for fixed drives. |
| `list_dir_json` | `{ path: string }` | JSON `{ ok, path, entries:[{name,isDir,size}] }` for any local `X:\…` path. |
| `list_apps_json` | — | JSON array of installed apps `{ name, version, location }` (registry). |
| `list_start_menu_json` | — | JSON array of Start Menu items `{ name, path }`. |
| `launch_path` | `{ path: string }` | `os.startfile` / open folder or `.lnk` / file. |
| `screen_snapshot` | — | JPEG base64 + monitor bounds + optional `imageWidth` / `imageHeight` if downscaled. |
| `screen_click_focus` | `{ x, y, vw, vh, left, top, width, height }` | Scale click to screen coords, left-click, `SetForegroundWindow` on window under cursor (best-effort). |
| `system_info` | — | PowerShell `Get-ComputerInfo` subset |
| `list_apps` | — | Registry uninstall keys (sample, text table) |
| `list_dir` | `{ path: string }` | Directory listing (text; same path rules as `list_dir_json`) |
| `open_browser` | `{ url, browser?: "default"\|"chrome"\|"edge"\|"firefox" }` | Launch browser |
| `network_info` | — | `ipconfig` |
| `tasks_list` | — | `schtasks /query` (truncated) |
| `logs_tail` | — | `Get-WinEvent` Application sample |
| `query_user_sessions` | — | `query user` (System32) |
| `net_share_list` | — | `net share` |
| `firewall_profiles` | — | `netsh advfirewall show allprofiles` |
| `startup_entries` | — | HKLM/HKCU `Run` registry values |
| `process_list_brief` | — | Top processes by working set |
| `services_brief` | — | Sample services table |
| `open_mmc` | `{ name?: string }` | Launches `mmc.exe` with an `.msc` from System32 (default `devmgmt.msc`) |
| `diskpart_list_disk` | — | Read-only `diskpart /s` script: `list disk` + `exit` |

---

## Security

- Do not expose `:4000` to the public internet without TLS, auth on sockets, and command allowlists.
- The agent runs as the Windows user that started it — treat it as **full machine access**.
