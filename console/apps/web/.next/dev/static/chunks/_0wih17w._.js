(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/hooks/useConsoleSocket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CONSOLE_SOCKET_PROXY_ENGINE_PATH",
    ()=>CONSOLE_SOCKET_PROXY_ENGINE_PATH,
    "getConsoleSocketUrl",
    ()=>getConsoleSocketUrl,
    "isLoopbackHost",
    ()=>isLoopbackHost,
    "useConsoleSocket",
    ()=>useConsoleSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function isLoopbackHost(host) {
    const h = host.toLowerCase();
    return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1';
}
/**
 * If the user opens the site as http://LAN-IP:3000 but `.env` still says localhost:4000,
 * the browser would otherwise connect to the *viewer's* loopback — never the API.
 * Rewrite loopback in env URLs to the page hostname; leave explicit non-loopback hosts unchanged.
 */ function rewriteLoopbackApiUrlForPage(url, pageHostname) {
    const trimmed = url.replace(/\/+$/, '');
    if (!pageHostname || isLoopbackHost(pageHostname)) {
        return trimmed;
    }
    try {
        const u = new URL(trimmed);
        if (!isLoopbackHost(u.hostname)) {
            return trimmed;
        }
        u.hostname = pageHostname;
        return u.toString().replace(/\/+$/, '');
    } catch  {
        return trimmed;
    }
}
function getConsoleSocketUrl() {
    const pageHost = ("TURBOPACK compile-time truthy", 1) ? window.location.hostname : "TURBOPACK unreachable";
    const direct = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SOCKET_URL?.trim();
    if (direct) {
        return rewriteLoopbackApiUrlForPage(direct, pageHost);
    }
    const origin = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_ORIGIN?.trim().replace(/\/+$/, '');
    if (origin) {
        const o = rewriteLoopbackApiUrlForPage(origin, pageHost);
        return `${o}/console`;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        const { protocol, hostname } = window.location;
        const loopback = isLoopbackHost(hostname);
        if (!loopback && protocol === 'http:') {
            return `http://${hostname}:4000/console`;
        }
        if (!loopback && protocol === 'https:') {
            return `https://${hostname}:4000/console`;
        }
    }
    return 'http://localhost:4000/console';
}
const CONSOLE_SOCKET_PROXY_ENGINE_PATH = '/console-socket/socket.io';
/**
 * When the UI is on :3000 and the API on :4000 on a **LAN hostname**, the browser treats that as
 * cross-origin; proxying Engine.IO through Next fixes that.
 * On **loopback** (localhost / 127.0.0.1), connect **directly** to :4000 — the proxy can hang in Edge InPrivate.
 */ function getConsoleSocketIoParams() {
    const directUrl = getConsoleSocketUrl();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const pageOrigin = window.location.origin;
    const pageHost = window.location.hostname;
    const pageIsLoopback = isLoopbackHost(pageHost);
    try {
        const api = new URL(directUrl);
        const page = new URL(pageOrigin);
        const apiPort = api.port || (api.protocol === 'https:' ? '443' : '80');
        const sameHost = api.hostname === page.hostname;
        const sameScheme = api.protocol === page.protocol;
        const useProxy = !pageIsLoopback && api.origin !== page.origin && sameHost && sameScheme && apiPort === '4000';
        if (useProxy) {
            return {
                url: `${pageOrigin}/console`,
                path: CONSOLE_SOCKET_PROXY_ENGINE_PATH,
                transports: [
                    'websocket',
                    'polling'
                ]
            };
        }
    } catch  {
    /* fall through to direct */ }
    return {
        url: directUrl,
        path: '/socket.io',
        transports: pageHost && !isLoopbackHost(pageHost) ? [
            'polling',
            'websocket'
        ] : [
            'websocket',
            'polling'
        ]
    };
}
function useConsoleSocket() {
    _s();
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [socket, setSocket] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [conn, setConn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [agents, setAgents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedMachineId, setSelectedMachineId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const pendingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const selectMachine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsoleSocket.useCallback[selectMachine]": (machineId)=>{
            const s = socketRef.current;
            if (!s?.connected) return;
            s.emit('console:set_target', {
                machineId
            });
            setSelectedMachineId(machineId);
        }
    }["useConsoleSocket.useCallback[selectMachine]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useConsoleSocket.useEffect": ()=>{
            const { url, path, transports } = getConsoleSocketIoParams();
            const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(url, {
                path,
                transports,
                timeout: 45_000,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 10_000
            });
            const onRoster = {
                "useConsoleSocket.useEffect.onRoster": (msg)=>{
                    const list = Array.isArray(msg?.agents) ? msg.agents : [];
                    setAgents(list);
                    setSelectedMachineId({
                        "useConsoleSocket.useEffect.onRoster": (cur)=>{
                            if (cur && list.some({
                                "useConsoleSocket.useEffect.onRoster": (a)=>a.machineId === cur
                            }["useConsoleSocket.useEffect.onRoster"])) return cur;
                            return list[0]?.machineId ?? null;
                        }
                    }["useConsoleSocket.useEffect.onRoster"]);
                }
            }["useConsoleSocket.useEffect.onRoster"];
            const onPortal = {
                "useConsoleSocket.useEffect.onPortal": (msg)=>{
                    const id = msg.requestId;
                    if (!id) return;
                    const p = pendingRef.current.get(id);
                    if (!p) return;
                    pendingRef.current.delete(id);
                    if (msg.ok === false) {
                        p.reject(new Error(msg.error || 'Portal request failed'));
                        return;
                    }
                    p.resolve(msg.data);
                }
            }["useConsoleSocket.useEffect.onPortal"];
            s.on('agents:roster', onRoster);
            s.on('connect', {
                "useConsoleSocket.useEffect": ()=>{
                    socketRef.current = s;
                    setSocket(s);
                    setConn('open');
                }
            }["useConsoleSocket.useEffect"]);
            s.on('disconnect', {
                "useConsoleSocket.useEffect": ()=>{
                    setConn('idle');
                }
            }["useConsoleSocket.useEffect"]);
            s.on('connect_error', {
                "useConsoleSocket.useEffect": ()=>{
                    setConn('error');
                }
            }["useConsoleSocket.useEffect"]);
            s.on('portal:result', onPortal);
            setConn('connecting');
            return ({
                "useConsoleSocket.useEffect": ()=>{
                    s.off('agents:roster', onRoster);
                    s.off('portal:result', onPortal);
                    s.disconnect();
                    socketRef.current = null;
                    pendingRef.current.clear();
                    setSocket(null);
                    setAgents([]);
                    setSelectedMachineId(null);
                    setConn('idle');
                }
            })["useConsoleSocket.useEffect"];
        }
    }["useConsoleSocket.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useConsoleSocket.useEffect": ()=>{
            const s = socketRef.current;
            if (!s?.connected || !selectedMachineId) return;
            s.emit('console:set_target', {
                machineId: selectedMachineId
            });
        }
    }["useConsoleSocket.useEffect"], [
        socket,
        selectedMachineId
    ]);
    const portalRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsoleSocket.useCallback[portalRequest]": (type, payload)=>{
            const s = socketRef.current;
            if (!s?.connected) {
                return Promise.reject(new Error('Socket not connected'));
            }
            const requestId = crypto.randomUUID();
            return new Promise({
                "useConsoleSocket.useCallback[portalRequest]": (resolve, reject)=>{
                    pendingRef.current.set(requestId, {
                        resolve,
                        reject
                    });
                    s.emit('portal:request', {
                        requestId,
                        type,
                        payload
                    });
                }
            }["useConsoleSocket.useCallback[portalRequest]"]);
        }
    }["useConsoleSocket.useCallback[portalRequest]"], []);
    return {
        socket,
        conn,
        portalRequest,
        agents,
        selectedMachineId,
        selectMachine
    };
}
_s(useConsoleSocket, "0OOl9MjEsLr6Djc9H3lkgsnd5Ag=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/stripPsClixml.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stripPsClixmlNoise",
    ()=>stripPsClixmlNoise
]);
const CLIXML_HEAD = /#<\s*CLIXML\s*\r?\n?/gi;
const ORPHAN_OBJ = /<Obj\s+S="(?:progress|information|verbose|warning|debug)"[\s\S]*?<\/Obj>\s*/gi;
function stripPsClixmlNoise(text) {
    if (!text) {
        return text;
    }
    let t = text.replace(CLIXML_HEAD, '');
    let lower = t.toLowerCase();
    while(lower.includes('<objs')){
        const idx = lower.indexOf('<objs');
        const endTag = '</objs>';
        const j = lower.indexOf(endTag, idx);
        if (j < 0) {
            t = t.slice(0, idx);
            break;
        }
        t = t.slice(0, idx) + t.slice(j + endTag.length);
        lower = t.toLowerCase();
    }
    for(let i = 0; i < 64; i++){
        const next = t.replace(ORPHAN_OBJ, '');
        if (next === t) {
            break;
        }
        t = next;
    }
    return t;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/TerminalPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TerminalPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$fit$2f$lib$2f$addon$2d$fit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/addon-fit/lib/addon-fit.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$unicode11$2f$lib$2f$addon$2d$unicode11$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/addon-unicode11/lib/addon-unicode11.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$web$2d$links$2f$lib$2f$addon$2d$web$2d$links$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/addon-web-links/lib/addon-web-links.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$xterm$2f$lib$2f$xterm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/xterm/lib/xterm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stripPsClixml$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/stripPsClixml.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function parseSession(raw) {
    if (typeof raw === 'string') {
        return JSON.parse(raw);
    }
    return raw;
}
function TerminalPanel({ socket, conn, portalRequest, shell, title, accountLine, machineLine, agentElevated = false, hideChrome = false, isActive = true }) {
    _s();
    const hostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const termRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fitRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sessionIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isActiveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(isActive);
    const resizeTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    isActiveRef.current = isActive;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TerminalPanel.useEffect": ()=>{
            if (!socket) return;
            const el = hostRef.current;
            if (!el) return;
            const term = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$xterm$2f$lib$2f$xterm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Terminal"]({
                allowProposedApi: true,
                allowTransparency: true,
                cursorBlink: true,
                convertEol: true,
                scrollback: 10000,
                lineHeight: 1.28,
                fontFamily: '"Segoe UI Mono", "Cascadia Mono", Consolas, "Liberation Mono", ui-monospace, monospace',
                fontSize: 13,
                theme: {
                    background: 'rgba(3, 3, 10, 0.35)',
                    foreground: '#c8fff4',
                    cursor: '#00f0ff',
                    selectionBackground: 'rgba(0, 240, 255, 0.22)',
                    green: '#39ff14',
                    cyan: '#22d3ee',
                    brightGreen: '#39ff14',
                    brightCyan: '#00f0ff'
                }
            });
            const unicode11 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$unicode11$2f$lib$2f$addon$2d$unicode11$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Unicode11Addon"]();
            term.loadAddon(unicode11);
            term.unicode.activeVersion = '11';
            const webLinks = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$web$2d$links$2f$lib$2f$addon$2d$web$2d$links$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebLinksAddon"]({
                "TerminalPanel.useEffect": (ev, uri)=>{
                    ev.preventDefault();
                    window.open(uri, '_blank', 'noopener,noreferrer');
                }
            }["TerminalPanel.useEffect"]);
            term.loadAddon(webLinks);
            const fit = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$fit$2f$lib$2f$addon$2d$fit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FitAddon"]();
            term.loadAddon(fit);
            term.open(el);
            fit.fit();
            const stopPty = {
                "TerminalPanel.useEffect.stopPty": ()=>{
                    const sid = sessionIdRef.current;
                    sessionIdRef.current = null;
                    if (sid && socket.connected) {
                        socket.emit('pty:close', {
                            sessionId: sid
                        });
                    }
                }
            }["TerminalPanel.useEffect.stopPty"];
            const startPty = {
                "TerminalPanel.useEffect.startPty": ()=>{
                    if (!socket.connected) return;
                    stopPty();
                    fit.fit();
                    const sid = crypto.randomUUID();
                    sessionIdRef.current = sid;
                    socket.emit('pty:start', {
                        sessionId: sid,
                        shell,
                        rows: term.rows,
                        cols: term.cols
                    });
                }
            }["TerminalPanel.useEffect.startPty"];
            const emitResize = {
                "TerminalPanel.useEffect.emitResize": ()=>{
                    const sid = sessionIdRef.current;
                    if (!sid || !socket.connected) return;
                    socket.emit('pty:resize', {
                        sessionId: sid,
                        rows: term.rows,
                        cols: term.cols
                    });
                }
            }["TerminalPanel.useEffect.emitResize"];
            const scheduleResize = {
                "TerminalPanel.useEffect.scheduleResize": ()=>{
                    if (!isActiveRef.current) return;
                    fit.fit();
                    if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
                    resizeTimerRef.current = setTimeout({
                        "TerminalPanel.useEffect.scheduleResize": ()=>{
                            resizeTimerRef.current = null;
                            emitResize();
                        }
                    }["TerminalPanel.useEffect.scheduleResize"], 80);
                }
            }["TerminalPanel.useEffect.scheduleResize"];
            const paintBanner = {
                "TerminalPanel.useEffect.paintBanner": async ()=>{
                    term.reset();
                    let who = accountLine?.trim();
                    let machine = machineLine?.trim();
                    if (!who || !machine) {
                        try {
                            const raw = await portalRequest('session_info');
                            const j = parseSession(raw);
                            if (!who) {
                                who = j.whoami || `${j.userDomain || ''}\\${j.userName || ''}`.replace(/^\\+/, '').replace(/\\+$/, '');
                                const adm = j.isElevated ? ' (Administrator / elevated)' : '';
                                who = `${who}${adm}`.trim();
                            }
                            if (!machine) {
                                machine = `${j.host || ''} · ${j.home || ''}`.trim();
                            }
                        } catch  {
                            who = who || '(session load failed)';
                        }
                    }
                    if (who) {
                        term.writeln(who);
                    }
                    if (machine) {
                        term.writeln(machine);
                    }
                    const label = shell === 'cmd' ? 'CMD' : shell === 'powershell_admin' ? 'PowerShell (elevated tab)' : 'PowerShell';
                    const adm = shell !== 'cmd' && agentElevated ? ' — Administrator context on agent' : '';
                    term.writeln(`${label}${adm} — interactive ConPTY session (UTF-8).`);
                    if (!hideChrome) {
                        term.writeln('Quick tools use a separate one-shot script runner (not this shell).');
                    }
                    term.writeln('');
                }
            }["TerminalPanel.useEffect.paintBanner"];
            const onPtyOut = {
                "TerminalPanel.useEffect.onPtyOut": (msg)=>{
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
                        data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stripPsClixml$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripPsClixmlNoise"])(data);
                    }
                    term.write(data);
                }
            }["TerminalPanel.useEffect.onPtyOut"];
            const onConnect = {
                "TerminalPanel.useEffect.onConnect": ()=>{
                    void ({
                        "TerminalPanel.useEffect.onConnect": async ()=>{
                            await paintBanner();
                            startPty();
                        }
                    })["TerminalPanel.useEffect.onConnect"]();
                }
            }["TerminalPanel.useEffect.onConnect"];
            const onDisconnect = {
                "TerminalPanel.useEffect.onDisconnect": ()=>{
                    stopPty();
                    term.writeln('\r\n\x1b[31mSocket disconnected.\x1b[0m\r\n');
                }
            }["TerminalPanel.useEffect.onDisconnect"];
            const onLog = {
                "TerminalPanel.useEffect.onLog": (msg)=>{
                    term.writeln(`\x1b[33m${msg?.line ?? ''}\x1b[0m`);
                }
            }["TerminalPanel.useEffect.onLog"];
            /** One-shot `agent:shell_exec` + multiline PS continuation (`>>`) from the gateway. */ const onLineShellOut = {
                "TerminalPanel.useEffect.onLineShellOut": (msg)=>{
                    const sh = msg.shell === 'cmd' ? 'cmd' : 'powershell';
                    const panel = shell === 'cmd' ? 'cmd' : 'powershell';
                    if (sh !== panel) return;
                    let data = msg.data ?? '';
                    if (shell !== 'cmd') {
                        data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stripPsClixml$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripPsClixmlNoise"])(data);
                    }
                    term.write(data);
                }
            }["TerminalPanel.useEffect.onLineShellOut"];
            socket.on('connect', onConnect);
            socket.on('disconnect', onDisconnect);
            socket.on('pty:output', onPtyOut);
            socket.on('terminal:output', onLineShellOut);
            socket.on('log:line', onLog);
            term.onData({
                "TerminalPanel.useEffect": (data)=>{
                    const sid = sessionIdRef.current;
                    if (!sid || !socket.connected) return;
                    socket.emit('pty:input', {
                        sessionId: sid,
                        data
                    });
                }
            }["TerminalPanel.useEffect"]);
            const pasteFromClipboard = {
                "TerminalPanel.useEffect.pasteFromClipboard": ()=>{
                    if (!navigator.clipboard?.readText) {
                        term.writeln('\r\n\x1b[33mClipboard API unavailable — use HTTPS or localhost.\x1b[0m\r\n');
                        return;
                    }
                    void navigator.clipboard.readText().then({
                        "TerminalPanel.useEffect.pasteFromClipboard": (t)=>{
                            if (t) {
                                const sid = sessionIdRef.current;
                                if (sid && socket.connected) {
                                    socket.emit('pty:input', {
                                        sessionId: sid,
                                        data: t
                                    });
                                }
                            }
                        }
                    }["TerminalPanel.useEffect.pasteFromClipboard"], {
                        "TerminalPanel.useEffect.pasteFromClipboard": ()=>{
                            term.writeln('\r\n\x1b[33mPaste blocked by the browser — click inside the terminal and try Ctrl+Shift+V.\x1b[0m\r\n');
                        }
                    }["TerminalPanel.useEffect.pasteFromClipboard"]);
                }
            }["TerminalPanel.useEffect.pasteFromClipboard"];
            term.attachCustomKeyEventHandler({
                "TerminalPanel.useEffect": (e)=>{
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
                            void navigator.clipboard.writeText(sel).catch({
                                "TerminalPanel.useEffect": ()=>{}
                            }["TerminalPanel.useEffect"]);
                            return false;
                        }
                    }
                    return true;
                }
            }["TerminalPanel.useEffect"]);
            const onPasteDom = {
                "TerminalPanel.useEffect.onPasteDom": (ev)=>{
                    const text = ev.clipboardData?.getData('text/plain');
                    if (text == null || text === '') {
                        return;
                    }
                    ev.preventDefault();
                    ev.stopPropagation();
                    const sid = sessionIdRef.current;
                    if (sid && socket.connected) {
                        socket.emit('pty:input', {
                            sessionId: sid,
                            data: text
                        });
                    }
                }
            }["TerminalPanel.useEffect.onPasteDom"];
            const root = term.element;
            if (root) {
                root.addEventListener('paste', onPasteDom, true);
            }
            const ro = new ResizeObserver({
                "TerminalPanel.useEffect": ()=>{
                    if (isActiveRef.current) {
                        scheduleResize();
                    }
                }
            }["TerminalPanel.useEffect"]);
            ro.observe(el);
            termRef.current = term;
            fitRef.current = fit;
            if (socket.connected) {
                void ({
                    "TerminalPanel.useEffect": async ()=>{
                        await paintBanner();
                        startPty();
                    }
                })["TerminalPanel.useEffect"]();
            }
            return ({
                "TerminalPanel.useEffect": ()=>{
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
                    socket.off('terminal:output', onLineShellOut);
                    socket.off('log:line', onLog);
                    stopPty();
                    term.dispose();
                    termRef.current = null;
                    fitRef.current = null;
                }
            })["TerminalPanel.useEffect"];
        }
    }["TerminalPanel.useEffect"], [
        socket,
        portalRequest,
        shell,
        accountLine,
        machineLine,
        agentElevated,
        hideChrome
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TerminalPanel.useEffect": ()=>{
            if (!isActive || !fitRef.current) return;
            const id = requestAnimationFrame({
                "TerminalPanel.useEffect.id": ()=>{
                    fitRef.current?.fit();
                    termRef.current?.focus();
                    const sid = sessionIdRef.current;
                    const term = termRef.current;
                    const s = socket;
                    if (sid && term && s?.connected) {
                        s.emit('pty:resize', {
                            sessionId: sid,
                            rows: term.rows,
                            cols: term.cols
                        });
                    }
                }
            }["TerminalPanel.useEffect.id"]);
            return ({
                "TerminalPanel.useEffect": ()=>cancelAnimationFrame(id)
            })["TerminalPanel.useEffect"];
        }
    }["TerminalPanel.useEffect"], [
        isActive,
        socket
    ]);
    const badge = conn === 'open' ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40' : conn === 'error' ? 'bg-rose-500/15 text-rose-300 ring-rose-500/40' : 'bg-cyan-500/15 text-cyan-200 ring-cyan-500/35';
    const shellBadge = shell === 'cmd' ? 'cmd.exe' : shell === 'powershell_admin' ? 'powershell (admin tab)' : 'powershell';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex h-full min-h-[280px] flex-col gap-2 rounded-xl border border-cyan-500/20 bg-zinc-950/25 p-2 shadow-[0_0_40px_rgba(0,240,255,0.06)] ring-1 ring-emerald-400/10 backdrop-blur-md",
        children: [
            !socket ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/80 text-sm text-cyan-200/90",
                children: "API connecting…"
            }, void 0, false, {
                fileName: "[project]/src/components/TerminalPanel.tsx",
                lineNumber: 379,
                columnNumber: 9
            }, this) : null,
            !hideChrome ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1 border-b border-cyan-500/20 pb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "bg-gradient-to-r from-cyan-200 to-emerald-300 bg-clip-text font-mono text-sm font-semibold tracking-wide text-transparent",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/TerminalPanel.tsx",
                                lineNumber: 386,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded border border-cyan-500/40 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-cyan-200",
                                children: shellBadge
                            }, void 0, false, {
                                fileName: "[project]/src/components/TerminalPanel.tsx",
                                lineNumber: 389,
                                columnNumber: 13
                            }, this),
                            shell === 'powershell_admin' || shell === 'powershell' && agentElevated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded border border-rose-500/50 bg-rose-950/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.35)]",
                                children: "[ADMIN]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/TerminalPanel.tsx",
                                lineNumber: 393,
                                columnNumber: 15
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${badge}`,
                                children: conn === 'open' ? 'Live' : conn === 'error' ? 'Error' : '…'
                            }, void 0, false, {
                                fileName: "[project]/src/components/TerminalPanel.tsx",
                                lineNumber: 397,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/TerminalPanel.tsx",
                        lineNumber: 385,
                        columnNumber: 11
                    }, this),
                    accountLine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[11px] font-medium leading-snug text-emerald-200/95",
                        children: accountLine
                    }, void 0, false, {
                        fileName: "[project]/src/components/TerminalPanel.tsx",
                        lineNumber: 404,
                        columnNumber: 13
                    }, this) : null,
                    machineLine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] leading-snug text-cyan-700/90",
                        children: machineLine
                    }, void 0, false, {
                        fileName: "[project]/src/components/TerminalPanel.tsx",
                        lineNumber: 407,
                        columnNumber: 13
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/TerminalPanel.tsx",
                lineNumber: 384,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: hostRef,
                className: "cyber-scroll min-h-[220px] flex-1 overflow-hidden rounded-lg border border-cyan-500/15 bg-black/20 p-1.5 outline-none focus-within:shadow-[0_0_24px_rgba(57,255,20,0.08)] focus-within:ring-2 focus-within:ring-cyan-400/25"
            }, void 0, false, {
                fileName: "[project]/src/components/TerminalPanel.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/TerminalPanel.tsx",
        lineNumber: 377,
        columnNumber: 5
    }, this);
}
_s(TerminalPanel, "Kcvn2s3VWrjrbxDopttcjFi2lek=");
_c = TerminalPanel;
var _c;
__turbopack_context__.k.register(_c, "TerminalPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/windowsQuickTools.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WINDOWS_QUICK_TOOL_GROUPS",
    ()=>WINDOWS_QUICK_TOOL_GROUPS
]);
const WINDOWS_QUICK_TOOL_GROUPS = [
    {
        title: 'Identity / policy',
        tools: [
            {
                id: 'sys32',
                label: 'Open System32 (Explorer)',
                shell: 'cmd',
                command: 'explorer C:\\Windows\\System32'
            },
            {
                id: 'whoami',
                label: 'whoami /all',
                shell: 'cmd',
                command: 'whoami /all'
            },
            {
                id: 'groups',
                label: 'net localgroup',
                shell: 'cmd',
                command: 'net localgroup'
            },
            {
                id: 'execpol',
                label: 'PS execution policy',
                shell: 'powershell',
                command: 'Get-ExecutionPolicy -List | Format-Table -AutoSize | Out-String -Width 220'
            },
            {
                id: 'psver',
                label: 'PS version table',
                shell: 'powershell',
                command: '$PSVersionTable | Format-List | Out-String -Width 220'
            }
        ]
    },
    {
        title: 'Network',
        tools: [
            {
                id: 'ipconfig',
                label: 'ipconfig /all',
                shell: 'cmd',
                command: 'ipconfig /all'
            },
            {
                id: 'netstat',
                label: 'netstat -ano',
                shell: 'cmd',
                command: 'netstat -ano'
            },
            {
                id: 'ping',
                label: 'ping 127.0.0.1',
                shell: 'cmd',
                command: 'ping -n 2 127.0.0.1'
            },
            {
                id: 'route',
                label: 'route print',
                shell: 'cmd',
                command: 'route print'
            },
            {
                id: 'arp',
                label: 'arp -a',
                shell: 'cmd',
                command: 'arp -a'
            }
        ]
    },
    {
        title: 'Processes / tasks',
        tools: [
            {
                id: 'tasklist',
                label: 'tasklist',
                shell: 'cmd',
                command: 'tasklist'
            },
            {
                id: 'qprocess',
                label: 'qprocess *',
                shell: 'cmd',
                command: 'qprocess *'
            },
            {
                id: 'schtasks',
                label: 'schtasks /query (table)',
                shell: 'cmd',
                command: 'schtasks /query /FO TABLE'
            },
            {
                id: 'psprocs',
                label: 'PS top CPU (sample)',
                shell: 'powershell',
                command: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 ProcessName,Id,CPU,WS | Format-Table -AutoSize | Out-String -Width 220'
            }
        ]
    },
    {
        title: 'Services (sc)',
        tools: [
            {
                id: 'scquery',
                label: 'sc query (first services)',
                shell: 'cmd',
                command: 'sc query type= service state= all'
            },
            {
                id: 'scqueryex',
                label: 'sc queryex (brief)',
                shell: 'cmd',
                command: 'sc queryex type= service state= active'
            }
        ]
    },
    {
        title: 'Registry (reg)',
        tools: [
            {
                id: 'regwin',
                label: 'reg query HKLM\\...\\CurrentVersion',
                shell: 'cmd',
                command: 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion"'
            },
            {
                id: 'regrun',
                label: 'reg query Run keys',
                shell: 'cmd',
                command: 'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"'
            }
        ]
    },
    {
        title: 'Users / shares (net)',
        tools: [
            {
                id: 'netuser',
                label: 'net user',
                shell: 'cmd',
                command: 'net user'
            },
            {
                id: 'netaccounts',
                label: 'net accounts',
                shell: 'cmd',
                command: 'net accounts'
            },
            {
                id: 'netshare',
                label: 'net share',
                shell: 'cmd',
                command: 'net share'
            },
            {
                id: 'netstatnet',
                label: 'netstat -n',
                shell: 'cmd',
                command: 'netstat -n'
            }
        ]
    },
    {
        title: 'Defender / AV (read-only samples)',
        tools: [
            {
                id: 'defpref',
                label: 'Get-MpPreference (sample)',
                shell: 'powershell',
                command: 'try { Get-MpPreference | Select-Object DisableRealtimeMonitoring,MAPSReporting,SubmitSamplesConsent | Format-List | Out-String -Width 220 } catch { $_.Exception.Message }'
            },
            {
                id: 'defstatus',
                label: 'Get-MpComputerStatus (sample)',
                shell: 'powershell',
                command: 'try { Get-MpComputerStatus | Select-Object AMServiceEnabled,AntispywareEnabled,AntivirusEnabled,NISEnabled,RealTimeProtectionEnabled | Format-List | Out-String -Width 220 } catch { $_.Exception.Message }'
            }
        ]
    },
    {
        title: 'DISM / SFC (slow — admin)',
        tools: [
            {
                id: 'dismhelp',
                label: 'DISM /?',
                shell: 'cmd',
                command: 'DISM /?'
            },
            {
                id: 'dismscan',
                label: 'DISM ScanHealth (long)',
                shell: 'cmd',
                command: 'DISM /Online /Cleanup-Image /ScanHealth'
            },
            {
                id: 'sfcverify',
                label: 'SFC /verifyonly',
                shell: 'cmd',
                command: 'sfc /verifyonly'
            }
        ]
    },
    {
        title: 'WMIC / CIM',
        tools: [
            {
                id: 'wmicos',
                label: 'wmic os (if available)',
                shell: 'cmd',
                command: 'wmic os get Caption,Version,OSArchitecture /format:list'
            },
            {
                id: 'cimos',
                label: 'CIM OS (modern)',
                shell: 'powershell',
                command: 'Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,OSArchitecture,LastBootUpTime | Format-List | Out-String -Width 220'
            }
        ]
    },
    {
        title: 'Events / GP / drivers (samples)',
        tools: [
            {
                id: 'appev',
                label: 'Application log (25)',
                shell: 'powershell',
                command: 'Get-WinEvent -LogName Application -MaxEvents 25 -ErrorAction SilentlyContinue | Format-Table TimeCreated,Id,LevelDisplayName -AutoSize | Out-String -Width 220'
            },
            {
                id: 'gpreport',
                label: 'gpresult /R',
                shell: 'cmd',
                command: 'gpresult /R'
            },
            {
                id: 'drvquery',
                label: 'driverquery (table)',
                shell: 'cmd',
                command: 'driverquery /FO table'
            }
        ]
    },
    {
        title: 'Clean audit (script file)',
        tools: [
            {
                id: 'cleanaudit',
                label: 'Run read-audit-clean.ps1 (plain text)',
                shell: 'powershell',
                command: "if (Test-Path '.\\\\scripts\\\\read-audit-clean.ps1') { & '.\\\\scripts\\\\read-audit-clean.ps1' } elseif (Test-Path (Join-Path $env:USERPROFILE 'Desktop\\\\console\\\\agent\\\\scripts\\\\read-audit-clean.ps1')) { & (Join-Path $env:USERPROFILE 'Desktop\\\\console\\\\agent\\\\scripts\\\\read-audit-clean.ps1') } else { Write-Output 'read-audit-clean.ps1 not found. cd to the repo agent folder (where scripts\\\\ lives) or run the file by full path - see agent\\\\scripts\\\\README.md.' }"
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/QuickToolsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuickToolsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$windowsQuickTools$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/windowsQuickTools.ts [app-client] (ecmascript)");
'use client';
;
;
function QuickToolsPanel({ socket, conn }) {
    const run = (shell, command)=>{
        if (!socket?.connected) return;
        const line = command.replace(/\r?\n$/, '');
        if (!line.trim()) return;
        socket.emit('terminal:input', {
            data: `${line}\n`,
            shell,
            force: true
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "cyber-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[11px] leading-relaxed text-cyan-800/90",
                children: [
                    "One-shot commands on the agent (",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        className: "text-cyan-600/95",
                        children: "force"
                    }, void 0, false, {
                        fileName: "[project]/src/components/QuickToolsPanel.tsx",
                        lineNumber: 24,
                        columnNumber: 41
                    }, this),
                    " flush). Admin-only tools need an elevated agent."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/QuickToolsPanel.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            !socket?.connected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-cyan-600/90",
                children: "Waiting for socket…"
            }, void 0, false, {
                fileName: "[project]/src/components/QuickToolsPanel.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this) : null,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$windowsQuickTools$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WINDOWS_QUICK_TOOL_GROUPS"].map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-cyan-900/35 bg-black/35 p-2 ring-1 ring-cyan-500/10 transition-shadow duration-200 hover:shadow-[0_0_20px_rgba(0,240,255,0.06)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "mb-2 border-b border-cyan-950/60 pb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-400/90",
                            children: g.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuickToolsPanel.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-1.5",
                            children: g.tools.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    disabled: conn !== 'open' || !socket?.connected,
                                    title: t.command,
                                    onClick: ()=>run(t.shell, t.command),
                                    className: "max-w-full truncate rounded-lg border border-cyan-900/40 bg-black/40 px-2 py-1 text-left text-[11px] font-medium text-cyan-100/90 ring-1 ring-transparent transition-all duration-200 hover:border-cyan-500/45 hover:shadow-[0_0_12px_rgba(0,240,255,0.1)] disabled:cursor-not-allowed disabled:opacity-35",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono text-[9px] uppercase text-emerald-400/90",
                                            children: t.shell === 'cmd' ? 'CMD' : 'PS'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/QuickToolsPanel.tsx",
                                            lineNumber: 48,
                                            columnNumber: 17
                                        }, this),
                                        ' ',
                                        t.label
                                    ]
                                }, t.id, true, {
                                    fileName: "[project]/src/components/QuickToolsPanel.tsx",
                                    lineNumber: 40,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuickToolsPanel.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    ]
                }, g.title, true, {
                    fileName: "[project]/src/components/QuickToolsPanel.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/QuickToolsPanel.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = QuickToolsPanel;
var _c;
__turbopack_context__.k.register(_c, "QuickToolsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/opsPortalActions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Portal types handled by the Windows agent — used by Ops sidebar and Operations tab. */ __turbopack_context__.s([
    "OPS_PORTAL_ACTIONS",
    ()=>OPS_PORTAL_ACTIONS
]);
const OPS_PORTAL_ACTIONS = [
    {
        type: 'query_user_sessions',
        label: 'Users / sessions (query)'
    },
    {
        type: 'process_list_brief',
        label: 'Processes'
    },
    {
        type: 'services_brief',
        label: 'Services'
    },
    {
        type: 'startup_entries',
        label: 'Startup (Run keys)'
    },
    {
        type: 'net_share_list',
        label: 'Shares (net)'
    },
    {
        type: 'firewall_profiles',
        label: 'Firewall profiles'
    },
    {
        type: 'network_info',
        label: 'Network (ipconfig)'
    },
    {
        type: 'logs_tail',
        label: 'Event log (sample)'
    },
    {
        type: 'tasks_list',
        label: 'Scheduled tasks'
    },
    {
        type: 'diskpart_list_disk',
        label: 'Diskpart list disk'
    },
    {
        type: 'system_info',
        label: 'System (OS / hardware)'
    },
    {
        type: 'open_mmc',
        label: 'Device Manager',
        payload: {
            name: 'devmgmt.msc'
        }
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ConsoleDashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConsoleDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.mjs [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-open.mjs [app-client] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hard-drive.mjs [app-client] (ecmascript) <export default as HardDrive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.mjs [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.mjs [app-client] (ecmascript) <export default as Minimize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2d$dot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MonitorDot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/monitor-dot.mjs [app-client] (ecmascript) <export default as MonitorDot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.mjs [app-client] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wrench.mjs [app-client] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useConsoleSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useConsoleSocket.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TerminalPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TerminalPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuickToolsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/QuickToolsPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$opsPortalActions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/opsPortalActions.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function parseJson(raw) {
    if (typeof raw === 'string') {
        return JSON.parse(raw);
    }
    return raw;
}
/** Parent folder for explorer `path`, or null to leave drive list (at drive root). */ function explorerParentPath(p) {
    let t = p.replace(/\//g, '\\').trim();
    while(t.endsWith('\\'))t = t.slice(0, -1);
    if (!t) return null;
    if (/^[A-Za-z]:$/.test(t)) return null;
    const u = t.lastIndexOf('\\');
    if (u <= 0) return null;
    const parent = t.slice(0, u);
    if (/^[A-Za-z]:$/.test(parent)) return `${parent}\\`;
    return `${parent}\\`;
}
function ConsoleDashboard({ boot }) {
    _s();
    const { socket, conn, portalRequest, agents, selectedMachineId, selectMachine } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useConsoleSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsoleSocket"])();
    const [path, setPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [dirLoading, setDirLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [drives, setDrives] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [entries, setEntries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [explorerError, setExplorerError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [appsTab, setAppsTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('installed');
    const [installed, setInstalled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [startMenu, setStartMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [appQuery, setAppQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [screenSrc, setScreenSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [screenMeta, setScreenMeta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [screenHint, setScreenHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [accountLine, setAccountLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [machineLine, setMachineLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [liveDesktop, setLiveDesktop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    /** mss monitor index: 1 = first physical display (see python mss monitors). */ const [screenMonitor, setScreenMonitor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const screenMonitorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(screenMonitor);
    screenMonitorRef.current = screenMonitor;
    const lastFrameSeq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const liveWatchdog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const gotLiveFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const liveNoFrameNotified = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const screenViewerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [screenFullscreen, setScreenFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [monitorOptions, setMonitorOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            index: 1,
            width: 0,
            height: 0,
            label: 'Display 1'
        }
    ]);
    const autoMonitorPickDone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            autoMonitorPickDone.current = false;
        }
    }["ConsoleDashboard.useEffect"], [
        selectedMachineId
    ]);
    const [shellTab, setShellTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('powershell');
    const [agentElevated, setAgentElevated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [leftTab, setLeftTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('explorer');
    const terminalSectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [sideLog, setSideLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [opsLogTitle, setOpsLogTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const bootAppliedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [terminalFocus, setTerminalFocus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileNavOpen, setMobileNavOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tabHeapMb, setTabHeapMb] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const refreshDrives = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsoleDashboard.useCallback[refreshDrives]": async ()=>{
            try {
                const raw = await portalRequest('list_drives');
                setDrives(parseJson(raw));
            } catch (e) {
                setExplorerError(e instanceof Error ? e.message : String(e));
            }
        }
    }["ConsoleDashboard.useCallback[refreshDrives]"], [
        portalRequest
    ]);
    const refreshDir = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsoleDashboard.useCallback[refreshDir]": async (p)=>{
            setDirLoading(true);
            setExplorerError(null);
            try {
                const raw = await portalRequest('list_dir_json', {
                    path: p
                });
                const j = parseJson(raw);
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
            } finally{
                setDirLoading(false);
            }
        }
    }["ConsoleDashboard.useCallback[refreshDir]"], [
        portalRequest
    ]);
    const refreshApps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsoleDashboard.useCallback[refreshApps]": async ()=>{
            try {
                const raw = await portalRequest('list_apps_json');
                const rows = parseJson(raw);
                const arr = Array.isArray(rows) ? rows : rows ? [
                    rows
                ] : [];
                setInstalled(arr);
            } catch  {
                setInstalled([]);
            }
            try {
                const raw2 = await portalRequest('list_start_menu_json');
                const rows2 = parseJson(raw2);
                const arr2 = Array.isArray(rows2) ? rows2 : rows2 ? [
                    rows2
                ] : [];
                setStartMenu(arr2);
            } catch  {
                setStartMenu([]);
            }
        }
    }["ConsoleDashboard.useCallback[refreshApps]"], [
        portalRequest
    ]);
    const captureScreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsoleDashboard.useCallback[captureScreen]": async (opts)=>{
            if (!opts?.preserveHint) {
                setScreenHint(null);
            }
            try {
                const raw = await portalRequest('screen_snapshot', {
                    monitor: screenMonitor
                });
                const snap = parseJson(raw);
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
                    height: snap.height
                });
            } catch (e) {
                setScreenHint(e instanceof Error ? e.message : String(e));
            }
        }
    }["ConsoleDashboard.useCallback[captureScreen]"], [
        portalRequest,
        screenMonitor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            if (!socket) return;
            void ({
                "ConsoleDashboard.useEffect": async ()=>{
                    await refreshDrives();
                    setEntries([]);
                    setExplorerError(null);
                    await refreshApps();
                }
            })["ConsoleDashboard.useEffect"]();
        }
    }["ConsoleDashboard.useEffect"], [
        socket,
        selectedMachineId,
        refreshDrives,
        refreshApps
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            if (!socket || !selectedMachineId) return;
            void ({
                "ConsoleDashboard.useEffect": async ()=>{
                    try {
                        const raw = await portalRequest('session_info');
                        const j = parseJson(raw);
                        const who = j.whoami || `${j.userDomain || ''}\\${j.userName || ''}`.replace(/^\\+/, '').replace(/\\+$/, '');
                        const admin = j.isElevated ? ' (Administrator / elevated)' : '';
                        setAccountLine(`${who}${admin}`);
                        setMachineLine(`${j.host || ''} · ${j.home || ''}`);
                        setAgentElevated(Boolean(j.isElevated));
                    } catch  {
                        setAccountLine(null);
                        setMachineLine(null);
                        setAgentElevated(false);
                    }
                }
            })["ConsoleDashboard.useEffect"]();
        }
    }["ConsoleDashboard.useEffect"], [
        socket,
        selectedMachineId,
        portalRequest
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            if (!socket || !selectedMachineId) return;
            void ({
                "ConsoleDashboard.useEffect": async ()=>{
                    try {
                        const raw = await portalRequest('list_monitors_json');
                        const rows = parseJson(raw);
                        if (!Array.isArray(rows) || rows.length === 0) return;
                        setMonitorOptions(rows);
                        if (rows.length >= 2 && !autoMonitorPickDone.current) {
                            autoMonitorPickDone.current = true;
                            setScreenMonitor(2);
                        } else {
                            setScreenMonitor({
                                "ConsoleDashboard.useEffect": (m)=>rows.some({
                                        "ConsoleDashboard.useEffect": (r)=>r.index === m
                                    }["ConsoleDashboard.useEffect"]) ? m : rows[0].index
                            }["ConsoleDashboard.useEffect"]);
                        }
                    } catch  {
                    /* agent older than list_monitors_json — keep 1..4 UI */ }
                }
            })["ConsoleDashboard.useEffect"]();
        }
    }["ConsoleDashboard.useEffect"], [
        socket,
        selectedMachineId,
        portalRequest
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            if (!socket) return;
            const onSockErr = {
                "ConsoleDashboard.useEffect.onSockErr": (e)=>{
                    setScreenHint({
                        "ConsoleDashboard.useEffect.onSockErr": (prev)=>prev ?? `Socket error: ${e.message}`
                    }["ConsoleDashboard.useEffect.onSockErr"]);
                }
            }["ConsoleDashboard.useEffect.onSockErr"];
            socket.on('connect_error', onSockErr);
            return ({
                "ConsoleDashboard.useEffect": ()=>{
                    socket.off('connect_error', onSockErr);
                }
            })["ConsoleDashboard.useEffect"];
        }
    }["ConsoleDashboard.useEffect"], [
        socket
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            const onFs = {
                "ConsoleDashboard.useEffect.onFs": ()=>{
                    setScreenFullscreen(document.fullscreenElement === screenViewerRef.current);
                }
            }["ConsoleDashboard.useEffect.onFs"];
            document.addEventListener('fullscreenchange', onFs);
            return ({
                "ConsoleDashboard.useEffect": ()=>document.removeEventListener('fullscreenchange', onFs)
            })["ConsoleDashboard.useEffect"];
        }
    }["ConsoleDashboard.useEffect"], []);
    const toggleScreenFullscreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsoleDashboard.useCallback[toggleScreenFullscreen]": async ()=>{
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
        }
    }["ConsoleDashboard.useCallback[toggleScreenFullscreen]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            if (!socket) return;
            const onFrame = {
                "ConsoleDashboard.useEffect.onFrame": (body)=>{
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
                        height: Number(body.height ?? 0)
                    });
                }
            }["ConsoleDashboard.useEffect.onFrame"];
            if (liveDesktop) {
                lastFrameSeq.current = 0;
                gotLiveFrame.current = false;
                liveNoFrameNotified.current = false;
                socket.on('screen:frame', onFrame);
                void ({
                    "ConsoleDashboard.useEffect": async ()=>{
                        try {
                            const dbg = await portalRequest('screen_debug', {
                                monitor: screenMonitorRef.current
                            });
                            const j = parseJson(dbg);
                            setScreenHint(`Screen check: mss=${String(j.hasMss)} pillow=${String(j.hasPillow)} capture=${String(j.captureOk)} mon=${String(j.monitor ?? screenMonitorRef.current)} ` + (j.captureError ? `err=${j.captureError} ` : '') + (j.jpegChars != null ? `jpeg~${j.jpegChars} chars` : ''));
                        } catch (e) {
                            setScreenHint(e instanceof Error ? e.message : String(e));
                        }
                    }
                })["ConsoleDashboard.useEffect"]();
                setTimeout({
                    "ConsoleDashboard.useEffect": ()=>{
                        void captureScreen({
                            preserveHint: true
                        });
                    }
                }["ConsoleDashboard.useEffect"], 200);
                liveWatchdog.current = setInterval({
                    "ConsoleDashboard.useEffect": ()=>{
                        if (!gotLiveFrame.current && !liveNoFrameNotified.current) {
                            liveNoFrameNotified.current = true;
                            setScreenHint({
                                "ConsoleDashboard.useEffect": (h)=>`${h ?? ''} | No live frames yet — check agent (mss/Pillow) and API.`
                            }["ConsoleDashboard.useEffect"]);
                        }
                    }
                }["ConsoleDashboard.useEffect"], 7000);
                return ({
                    "ConsoleDashboard.useEffect": ()=>{
                        if (liveWatchdog.current) {
                            clearInterval(liveWatchdog.current);
                            liveWatchdog.current = null;
                        }
                        socket.emit('screen:control', {
                            action: 'stop'
                        });
                        socket.off('screen:frame', onFrame);
                    }
                })["ConsoleDashboard.useEffect"];
            }
            return undefined;
        }
    }["ConsoleDashboard.useEffect"], [
        socket,
        liveDesktop,
        selectedMachineId,
        portalRequest,
        captureScreen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            if (!socket?.connected || !liveDesktop) return;
            socket.emit('screen:control', {
                action: 'start',
                fps: 4,
                monitor: screenMonitor
            });
        }
    }["ConsoleDashboard.useEffect"], [
        socket,
        liveDesktop,
        screenMonitor,
        selectedMachineId
    ]);
    const breadcrumb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsoleDashboard.useMemo[breadcrumb]": ()=>{
            if (!path.trim()) return [];
            const p = path.replace(/[/\\]+$/, '');
            const parts = p.split(/\\+/).filter(Boolean);
            const out = [];
            let acc = parts[0]?.endsWith(':') ? `${parts[0]}\\` : '';
            const startIdx = parts[0]?.endsWith(':') ? 1 : 0;
            if (parts[0]?.endsWith(':')) {
                out.push({
                    label: parts[0],
                    full: acc
                });
            }
            for(let i = startIdx; i < parts.length; i++){
                acc = `${acc}${parts[i]}\\`;
                out.push({
                    label: parts[i],
                    full: acc
                });
            }
            return out;
        }
    }["ConsoleDashboard.useMemo[breadcrumb]"], [
        path
    ]);
    const filteredInstalled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsoleDashboard.useMemo[filteredInstalled]": ()=>{
            const q = appQuery.trim().toLowerCase();
            if (!q) return installed;
            return installed.filter({
                "ConsoleDashboard.useMemo[filteredInstalled]": (a)=>(a.name || '').toLowerCase().includes(q)
            }["ConsoleDashboard.useMemo[filteredInstalled]"]);
        }
    }["ConsoleDashboard.useMemo[filteredInstalled]"], [
        installed,
        appQuery
    ]);
    const filteredStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsoleDashboard.useMemo[filteredStart]": ()=>{
            const q = appQuery.trim().toLowerCase();
            if (!q) return startMenu;
            return startMenu.filter({
                "ConsoleDashboard.useMemo[filteredStart]": (a)=>(a.name || '').toLowerCase().includes(q)
            }["ConsoleDashboard.useMemo[filteredStart]"]);
        }
    }["ConsoleDashboard.useMemo[filteredStart]"], [
        startMenu,
        appQuery
    ]);
    const filteredEntries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsoleDashboard.useMemo[filteredEntries]": ()=>{
            if (!path.trim()) return [];
            const q = appQuery.trim().toLowerCase();
            if (!q) return entries;
            return entries.filter({
                "ConsoleDashboard.useMemo[filteredEntries]": (e)=>e.name.toLowerCase().includes(q)
            }["ConsoleDashboard.useMemo[filteredEntries]"]);
        }
    }["ConsoleDashboard.useMemo[filteredEntries]"], [
        path,
        entries,
        appQuery
    ]);
    const drivesEmpty = drives.length === 0;
    const onScreenClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsoleDashboard.useCallback[onScreenClick]": async (e)=>{
            if (!screenMeta) return;
            const img = e.currentTarget;
            const rect = img.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width * img.naturalWidth;
            const ny = (e.clientY - rect.top) / rect.height * img.naturalHeight;
            try {
                const msg = await portalRequest('screen_click_focus', {
                    x: nx,
                    y: ny,
                    vw: img.naturalWidth,
                    vh: img.naturalHeight,
                    left: screenMeta.left,
                    top: screenMeta.top,
                    width: screenMeta.width,
                    height: screenMeta.height
                });
                setScreenHint(String(msg));
            } catch (err) {
                setScreenHint(err instanceof Error ? err.message : String(err));
            }
        }
    }["ConsoleDashboard.useCallback[onScreenClick]"], [
        portalRequest,
        screenMeta
    ]);
    const runOpsFromMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsoleDashboard.useCallback[runOpsFromMenu]": async (type, label, payload)=>{
            setTerminalFocus(false);
            setLeftTab('operations');
            setOpsLogTitle(label);
            setSideLog('…');
            try {
                const raw = await portalRequest(type, payload);
                setSideLog(String(raw).slice(0, 24_000));
            } catch (e) {
                setSideLog(e instanceof Error ? e.message : String(e));
            }
        }
    }["ConsoleDashboard.useCallback[runOpsFromMenu]"], [
        portalRequest
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            if (!boot || bootAppliedRef.current) return;
            if (boot.terminalFocus) {
                bootAppliedRef.current = true;
                setTerminalFocus(true);
                return;
            }
            if (!socket?.connected) return;
            if (boot.opsPortal && !selectedMachineId) return;
            bootAppliedRef.current = true;
            if (boot.opsPortal) {
                void runOpsFromMenu(boot.opsPortal.type, boot.opsPortal.label, boot.opsPortal.payload);
                return;
            }
            if (boot.leftTab) {
                setLeftTab(boot.leftTab);
            }
        }
    }["ConsoleDashboard.useEffect"], [
        boot,
        socket?.connected,
        selectedMachineId,
        runOpsFromMenu
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsoleDashboard.useEffect": ()=>{
            const tick = {
                "ConsoleDashboard.useEffect.tick": ()=>{
                    const perf = performance;
                    if (perf.memory) setTabHeapMb(Math.round(perf.memory.usedJSHeapSize / 1024 / 1024));
                }
            }["ConsoleDashboard.useEffect.tick"];
            tick();
            const id = window.setInterval(tick, 4000);
            return ({
                "ConsoleDashboard.useEffect": ()=>window.clearInterval(id)
            })["ConsoleDashboard.useEffect"];
        }
    }["ConsoleDashboard.useEffect"], []);
    const closeMobileNav = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsoleDashboard.useCallback[closeMobileNav]": ()=>setMobileNavOpen(false)
    }["ConsoleDashboard.useCallback[closeMobileNav]"], []);
    const renderSidebarNav = (opts)=>{
        const { compact, onPick } = opts;
        const pick = ()=>{
            onPick?.();
        };
        const navBtn = (active, extra)=>`${compact ? 'flex h-10 w-10 items-center justify-center rounded-lg p-0' : 'cyber-nav-btn'} ${active ? 'cyber-nav-btn-active border-cyan-400/45' : ''} ${extra}`;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `cyber-panel flex flex-col ${compact ? 'items-center gap-1 p-1.5' : 'gap-1 p-2'}`,
            children: [
                !compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "border-b border-cyan-500/25 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90",
                    children: "Console"
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 489,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Dashboard",
                    className: navBtn(leftTab === 'dashboard', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('dashboard');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 502,
                        columnNumber: 22
                    }, this) : 'Dashboard'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 493,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Drives / Explorer",
                    className: navBtn(leftTab === 'explorer', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('explorer');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 513,
                        columnNumber: 22
                    }, this) : 'Drives / Explorer'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 504,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Programs",
                    className: navBtn(leftTab === 'apps', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('apps');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 524,
                        columnNumber: 22
                    }, this) : 'Programs'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 515,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Desktop stream",
                    className: navBtn(leftTab === 'screen', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('screen');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2d$dot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MonitorDot$3e$__["MonitorDot"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 535,
                        columnNumber: 22
                    }, this) : 'Desktop stream'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 526,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Quick tools",
                    className: navBtn(leftTab === 'tools', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('tools');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 546,
                        columnNumber: 22
                    }, this) : 'Quick tools'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 537,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Operations & diagnostics",
                    className: navBtn(leftTab === 'operations', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('operations');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 557,
                        columnNumber: 22
                    }, this) : 'Operations'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 548,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Terminal workspace",
                    className: navBtn(false, 'mt-1 border border-cyan-800/50 text-cyan-200/90 hover:border-cyan-500/40'),
                    onClick: ()=>{
                        setTerminalFocus(true);
                        setMobileNavOpen(false);
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 569,
                        columnNumber: 22
                    }, this) : 'Terminal workspace'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 559,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ConsoleDashboard.tsx",
            lineNumber: 487,
            columnNumber: 7
        }, this);
    };
    const renderOpsPanel = (opts)=>{
        if (opts.compact) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cyber-panel flex flex-col items-center p-1.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Ops: open quick tools tab",
                    className: "flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-800/40 text-emerald-200/90 hover:border-emerald-500/40",
                    onClick: ()=>{
                        if (terminalFocus) {
                            setTerminalFocus(false);
                        }
                        setLeftTab('operations');
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 590,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 579,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                lineNumber: 578,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "cyber-panel flex max-h-[55vh] min-h-0 flex-1 flex-col gap-1 overflow-hidden p-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "border-b border-emerald-500/25 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/90",
                    children: "Ops"
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 597,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cyber-scroll flex max-h-[42vh] flex-col gap-1 overflow-y-auto pr-1",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$opsPortalActions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OPS_PORTAL_ACTIONS"].map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "cyber-nav-btn py-1.5 text-[10px] leading-tight text-emerald-200/85",
                            onClick: ()=>{
                                if (terminalFocus) {
                                    setTerminalFocus(false);
                                }
                                void runOpsFromMenu(a.type, a.label, a.payload);
                            },
                            children: a.label
                        }, a.type + (a.payload?.name ? String(a.payload.name) : ''), false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 602,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 600,
                    columnNumber: 9
                }, this),
                sideLog && leftTab !== 'operations' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                    className: "cyber-scroll mt-1 max-h-40 shrink-0 overflow-auto rounded-lg border border-emerald-500/20 bg-black/70 p-2 text-[9px] leading-snug text-emerald-100/90",
                    children: sideLog
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 618,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ConsoleDashboard.tsx",
            lineNumber: 596,
            columnNumber: 7
        }, this);
    };
    const sidebarPad = sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-52';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative z-[3] flex w-full flex-col ${terminalFocus ? 'h-dvh min-h-0 overflow-hidden' : 'min-h-full'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed inset-0 z-[2] matrix-scanlines opacity-[0.06]",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                lineNumber: 632,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "fixed top-0 right-0 left-0 z-[500] flex h-14 items-center gap-2 border-b border-cyan-500/20 bg-zinc-950/45 px-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl md:gap-3 md:px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "rounded-lg border border-cyan-800/50 p-2 text-cyan-200 hover:border-cyan-500/40 lg:hidden",
                        "aria-label": "Open navigation",
                        onClick: ()=>setMobileNavOpen((v)=>!v),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 641,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 635,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-sm font-bold tracking-tight text-transparent sm:inline",
                        children: "NEXUS INTELLIGENCE"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 643,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${conn === 'open' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(74,222,128,0.2)]' : conn === 'connecting' ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200' : 'border-rose-500/35 bg-rose-950/40 text-rose-200/90'}`,
                        children: conn === 'open' ? 'Online' : conn === 'connecting' ? 'Connecting' : 'Offline'
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 646,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex min-w-0 max-w-[min(100vw-12rem,22rem)] shrink-0 items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden text-[9px] font-semibold uppercase tracking-wide text-cyan-600/90 sm:inline",
                                children: "Machine"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 657,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                title: "Choose which PC the console controls",
                                className: "cyber-input max-w-full min-w-0 flex-1 py-1 text-[10px] font-medium sm:text-xs",
                                value: selectedMachineId ?? '',
                                onChange: (e)=>{
                                    const v = e.target.value;
                                    if (v) selectMachine(v);
                                },
                                disabled: !socket?.connected || agents.length === 0,
                                children: agents.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "No agents online"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                    lineNumber: 671,
                                    columnNumber: 15
                                }, this) : agents.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: a.machineId,
                                        children: [
                                            a.host,
                                            " (",
                                            a.machineId.slice(0, 8),
                                            "…)"
                                        ]
                                    }, a.machineId, true, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 674,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 660,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 656,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden min-w-0 truncate text-[10px] text-cyan-700/95 md:inline lg:max-w-[14rem]",
                        children: [
                            shellTab === 'powershell' ? 'PS' : 'CMD',
                            " · ",
                            accountLine ?? '—'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 681,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: appQuery,
                        onChange: (e)=>setAppQuery(e.target.value),
                        placeholder: "Search files & apps…",
                        className: "cyber-input ml-auto min-w-0 max-w-[11rem] flex-1 py-1.5 text-xs sm:max-w-xs",
                        "aria-label": "Search files and applications"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 684,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        title: terminalFocus ? 'Show full dashboard' : 'Terminal fills workspace',
                        className: `cyber-btn shrink-0 px-2 py-1.5 ${terminalFocus ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.3)]' : 'border-cyan-600/40'}`,
                        onClick: ()=>setTerminalFocus((v)=>!v),
                        children: terminalFocus ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 700,
                            columnNumber: 28
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 700,
                            columnNumber: 64
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 691,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        title: sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar',
                        className: "cyber-btn cyber-btn-ghost hidden shrink-0 px-2 py-1.5 lg:inline-flex",
                        onClick: ()=>setSidebarCollapsed((c)=>!c),
                        children: sidebarCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 708,
                            columnNumber: 31
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 708,
                            columnNumber: 70
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 702,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden shrink-0 text-[9px] text-cyan-800/90 xl:inline",
                        title: "Browser tab JS heap (approx.)",
                        children: [
                            "RAM ~",
                            tabHeapMb != null ? `${tabHeapMb} MB` : '—'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 710,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                lineNumber: 634,
                columnNumber: 7
            }, this),
            mobileNavOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "fixed inset-0 z-[498] bg-black/55 backdrop-blur-sm lg:hidden",
                        "aria-label": "Close menu",
                        onClick: closeMobileNav
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 717,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "fixed top-14 bottom-0 left-0 z-[499] flex w-56 flex-col gap-2 overflow-y-auto border-r border-cyan-900/35 bg-black/92 p-2 shadow-2xl lg:hidden",
                        children: [
                            renderSidebarNav({
                                compact: false,
                                onPick: closeMobileNav
                            }),
                            renderOpsPanel({
                                compact: false
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 723,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `fixed top-14 bottom-0 left-0 z-[490] hidden flex-col gap-2 border-r border-cyan-900/30 bg-black/75 py-2 shadow-[8px_0_40px_rgba(0,0,0,0.45)] backdrop-blur-lg transition-[width] duration-300 ease-out lg:flex ${sidebarCollapsed ? 'w-16 overflow-hidden' : 'w-52 px-2'}`,
                children: [
                    renderSidebarNav({
                        compact: sidebarCollapsed
                    }),
                    renderOpsPanel({
                        compact: sidebarCollapsed
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                lineNumber: 730,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative flex min-h-0 flex-1 flex-col ${sidebarPad} pt-14`,
                children: !terminalFocus ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex w-full max-w-[1920px] min-w-0 flex-1 flex-col gap-4 px-3 pb-8 pt-4 md:px-5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid flex-1 grid-cols-1 items-stretch gap-4 min-h-[calc(100dvh-9rem)] lg:min-h-[calc(100dvh-8.5rem)] lg:grid-cols-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "flex min-h-0 flex-col gap-3 lg:col-span-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
                                value: leftTab,
                                onValueChange: (v)=>setLeftTab(v),
                                className: "cyber-panel flex min-h-[min(480px,calc(100dvh-10rem))] flex-1 flex-col overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"], {
                                        className: "flex shrink-0 flex-wrap gap-1 border-b border-cyan-500/20 bg-black/40 p-1 lg:hidden",
                                        children: [
                                            'dashboard',
                                            'explorer',
                                            'apps',
                                            'screen',
                                            'tools',
                                            'operations'
                                        ].map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
                                                value: v,
                                                className: "min-w-0 flex-1 rounded-md px-2 py-2 text-xs font-medium text-cyan-200/50 transition-colors data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-50 data-[state=active]:shadow-[0_0_16px_rgba(0,240,255,0.12)] md:px-3 md:text-sm",
                                                children: v === 'dashboard' ? 'Home' : v === 'explorer' ? 'Drives & files' : v === 'apps' ? 'Programs' : v === 'screen' ? 'Desktop view' : v === 'tools' ? 'Quick tools' : 'Operations'
                                            }, v, false, {
                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                lineNumber: 754,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 752,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "dashboard",
                                        className: "flex flex-1 flex-col p-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dashboard, {}, void 0, false, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 775,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 774,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "explorer",
                                        className: "flex min-h-0 flex-1 flex-col gap-2 p-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex min-h-0 flex-1 flex-col gap-3 ${drivesEmpty ? '' : 'lg:flex-row'}`,
                                            children: [
                                                !drivesEmpty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                                    className: "flex shrink-0 flex-col gap-2 overflow-x-auto pb-1 lg:w-48 lg:min-w-[11rem] lg:flex-shrink-0 lg:overflow-y-auto lg:pb-0 lg:pr-1",
                                                    "aria-label": "Drives",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-2 px-0.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-600/90 lg:block",
                                                                    children: "This PC"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 786,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>void refreshDrives(),
                                                                    className: "cyber-btn shrink-0 px-2 py-1 text-[10px] lg:px-1.5",
                                                                    title: "Reload drive list",
                                                                    children: "Refresh"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 789,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 785,
                                                            columnNumber: 27
                                                        }, this),
                                                        path.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                const parent = explorerParentPath(path);
                                                                if (parent == null) {
                                                                    setPath('');
                                                                    setEntries([]);
                                                                    setExplorerError(null);
                                                                    setDirLoading(false);
                                                                } else {
                                                                    void refreshDir(parent);
                                                                }
                                                            },
                                                            className: "cyber-btn cyber-btn-ghost w-full px-2 py-1.5 text-left text-[10px] lg:text-xs",
                                                            children: "← Back"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 799,
                                                            columnNumber: 29
                                                        }, this) : null,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2 overflow-x-auto lg:flex-col lg:overflow-x-visible lg:gap-1.5",
                                                            children: drives.map((d)=>{
                                                                const root = d.path.replace(/[/\\]+$/, '').toUpperCase();
                                                                const cur = path.replace(/[/\\]+$/, '').toUpperCase();
                                                                const active = cur === root || cur.startsWith(`${root}\\`);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    title: d.path,
                                                                    onClick: ()=>{
                                                                        const rootPath = d.path.replace(/[/\\]+$/, '');
                                                                        setPath(`${rootPath}\\`);
                                                                        setEntries([]);
                                                                        setExplorerError(null);
                                                                        void refreshDir(d.path);
                                                                    },
                                                                    className: `flex min-w-[6.5rem] flex-col items-start gap-0.5 rounded-xl border px-2.5 py-2 text-left transition-all lg:min-w-0 lg:w-full ${active ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-50 shadow-[0_0_16px_rgba(0,240,255,0.14)] ring-1 ring-cyan-400/25' : 'border-cyan-900/40 bg-black/20 text-cyan-100/90 hover:border-cyan-500/45 hover:bg-cyan-500/5'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "flex items-center gap-1.5 text-[11px] font-semibold tracking-tight",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__["HardDrive"], {
                                                                                    className: "h-3.5 w-3.5 shrink-0 text-cyan-400/90",
                                                                                    "aria-hidden": true
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                    lineNumber: 840,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                d.letter,
                                                                                ": ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-normal text-cyan-700/90",
                                                                                    children: "Local Disk"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                    lineNumber: 841,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 839,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        d.freeGb != null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "pl-5 text-[10px] text-zinc-500",
                                                                            children: [
                                                                                d.freeGb,
                                                                                " GB free"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 844,
                                                                            columnNumber: 37
                                                                        }, this) : null
                                                                    ]
                                                                }, d.letter, true, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 823,
                                                                    columnNumber: 33
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 817,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 781,
                                                    columnNumber: 25
                                                }, this) : null,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex min-h-0 min-w-0 flex-1 flex-col",
                                                    children: !path.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border border-cyan-900/25 bg-black/20 px-4 py-8 text-center",
                                                        children: drivesEmpty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "max-w-[18rem] text-xs leading-relaxed text-cyan-700/90",
                                                                    children: "No drives listed — connect the Windows agent, then reload. The drive column appears on the left once volumes are available."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 857,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>void refreshDrives(),
                                                                    className: "cyber-btn mt-4 text-xs",
                                                                    children: "Retry drives"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 861,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "max-w-[15rem] text-xs leading-relaxed text-cyan-700/90",
                                                            children: "Select a drive on the left to browse folders and files."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 866,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 854,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex min-h-0 min-w-0 flex-1 flex-col gap-2",
                                                        children: [
                                                            dirLoading && !explorerError && entries.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "shrink-0 text-[11px] text-cyan-600/90",
                                                                children: "Loading directory…"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 874,
                                                                columnNumber: 31
                                                            }, this) : null,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            const parent = explorerParentPath(path);
                                                                            if (parent == null) {
                                                                                setPath('');
                                                                                setEntries([]);
                                                                                setExplorerError(null);
                                                                                setDirLoading(false);
                                                                            } else {
                                                                                void refreshDir(parent);
                                                                            }
                                                                        },
                                                                        className: "cyber-btn cyber-btn-ghost",
                                                                        children: "← Back"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                        lineNumber: 877,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            setPath('');
                                                                            setEntries([]);
                                                                            setExplorerError(null);
                                                                            setDirLoading(false);
                                                                        },
                                                                        className: "cyber-btn cyber-btn-ghost",
                                                                        children: "All drives"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                        lineNumber: 894,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            void refreshDrives();
                                                                            void refreshDir(path);
                                                                        },
                                                                        className: "cyber-btn",
                                                                        children: "Refresh"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                        lineNumber: 906,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: async ()=>{
                                                                            try {
                                                                                await portalRequest('launch_path', {
                                                                                    path
                                                                                });
                                                                                setScreenHint(`Opened folder: ${path}`);
                                                                            } catch (e) {
                                                                                setScreenHint(e instanceof Error ? e.message : String(e));
                                                                            }
                                                                        },
                                                                        className: "cyber-btn cyber-btn-emerald",
                                                                        children: "Open in Windows"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                        lineNumber: 916,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 876,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                                                className: "flex min-h-[2rem] flex-wrap items-center gap-1 rounded-lg border border-cyan-900/25 bg-black/15 px-2 py-1.5 text-xs text-cyan-800/90",
                                                                children: breadcrumb.map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            i > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-cyan-900",
                                                                                children: "\\"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                lineNumber: 934,
                                                                                columnNumber: 44
                                                                            }, this) : null,
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                className: "rounded px-0.5 text-cyan-200/85 transition-colors duration-150 hover:text-cyan-50 hover:underline",
                                                                                onClick: ()=>void refreshDir(b.full),
                                                                                children: b.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                lineNumber: 935,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, b.full, true, {
                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                        lineNumber: 933,
                                                                        columnNumber: 33
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 931,
                                                                columnNumber: 29
                                                            }, this),
                                                            explorerError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-rose-400",
                                                                children: explorerError
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 946,
                                                                columnNumber: 31
                                                            }, this) : null,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "cyber-scroll min-h-0 flex-1 overflow-auto rounded-lg border border-cyan-900/30 bg-black/10",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                    className: "divide-y divide-cyan-950/50",
                                                                    children: filteredEntries.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                className: "flex w-full items-center justify-between px-3 py-2 text-left text-sm text-cyan-50/90 transition-colors duration-150 hover:bg-cyan-500/5",
                                                                                onDoubleClick: ()=>{
                                                                                    const next = `${path.replace(/[/\\]+$/, '')}\\${e.name}`;
                                                                                    if (e.isDir) void refreshDir(next);
                                                                                },
                                                                                onClick: ()=>{
                                                                                    const full = `${path.replace(/[/\\]+$/, '')}\\${e.name}`;
                                                                                    if (!e.isDir && /\.(exe|bat|cmd|msi)$/i.test(e.name)) {
                                                                                        void portalRequest('launch_path', {
                                                                                            path: full
                                                                                        }).catch(()=>{});
                                                                                    }
                                                                                },
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "truncate text-cyan-50/95",
                                                                                        children: [
                                                                                            e.isDir ? '[DIR] ' : '',
                                                                                            e.name
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                        lineNumber: 966,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    e.size != null && !e.isDir ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "shrink-0 pl-2 text-[10px] text-cyan-700/90",
                                                                                        children: [
                                                                                            (e.size / 1024).toFixed(0),
                                                                                            " KB"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                        lineNumber: 971,
                                                                                        columnNumber: 41
                                                                                    }, this) : null
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                lineNumber: 952,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        }, e.name, false, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 951,
                                                                            columnNumber: 35
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 949,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 948,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] leading-relaxed text-cyan-900/80",
                                                                children: [
                                                                    "Double-click a folder to open. Click an ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                        className: "text-cyan-600/90",
                                                                        children: ".exe"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                        lineNumber: 981,
                                                                        columnNumber: 71
                                                                    }, this),
                                                                    " to launch on the agent."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 980,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 872,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 852,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 779,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 778,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "apps",
                                        className: "flex flex-1 flex-col gap-2 p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setAppsTab('installed'),
                                                        className: `rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition-all duration-200 ${appsTab === 'installed' ? 'cyber-pill-active ring-emerald-500/30' : 'cyber-pill-idle'}`,
                                                        children: "Installed"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 992,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setAppsTab('start'),
                                                        className: `rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition-all duration-200 ${appsTab === 'start' ? 'cyber-pill-active ring-emerald-500/30' : 'cyber-pill-idle'}`,
                                                        children: "Start menu"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 1000,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>void refreshApps(),
                                                        className: "cyber-btn ml-auto",
                                                        children: "Reload"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 1008,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                lineNumber: 991,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-cyan-800/90",
                                                children: "Filter with the header search bar."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                lineNumber: 1016,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "cyber-scroll min-h-0 flex-1 overflow-auto rounded-lg border border-cyan-900/35 bg-black/30",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "divide-y divide-cyan-950/50",
                                                    children: (appsTab === 'installed' ? filteredInstalled : filteredStart).map((a, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-center gap-2 px-3 py-2 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "min-w-0 flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "truncate font-medium text-cyan-50/95",
                                                                            children: a.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 1022,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "truncate text-[11px] text-cyan-800/90",
                                                                            children: appsTab === 'installed' ? a.location || a.version : a.path
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 1023,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 1021,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "cyber-btn shrink-0 px-2 py-1 text-[11px]",
                                                                    onClick: ()=>{
                                                                        const target = appsTab === 'start' ? String(a.path || '') : String(a.location || '').trim();
                                                                        if (!target) return;
                                                                        void portalRequest('launch_path', {
                                                                            path: target
                                                                        }).catch(()=>{});
                                                                    },
                                                                    children: "Open"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 1027,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, `${a.name}-${idx}`, true, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1020,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1018,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                lineNumber: 1017,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 990,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "tools",
                                        className: "flex min-h-0 flex-1 flex-col",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuickToolsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            socket: socket,
                                            conn: conn
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 1048,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1047,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "screen",
                                        className: "flex min-h-0 flex-1 flex-col gap-3 p-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: screenViewerRef,
                                            className: `flex min-h-[min(320px,calc(100dvh-18rem))] flex-1 flex-col gap-3 ${screenFullscreen ? 'box-border h-full bg-black/50 p-2' : ''}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setLiveDesktop((v)=>{
                                                                    const next = !v;
                                                                    setScreenHint(next ? 'Live stream starting…' : 'Live stopped.');
                                                                    return next;
                                                                });
                                                            },
                                                            className: `cyber-btn ${liveDesktop ? 'cyber-btn-emerald' : ''}`,
                                                            children: liveDesktop ? 'Stop live' : 'Live desktop'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1057,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>void captureScreen(),
                                                            disabled: liveDesktop,
                                                            className: "cyber-btn cyber-btn-ghost disabled:pointer-events-none",
                                                            children: "Snapshot"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1070,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>void toggleScreenFullscreen(),
                                                            className: "cyber-btn cyber-btn-ghost",
                                                            children: screenFullscreen ? 'Exit full screen' : 'Full screen'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1078,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "ml-auto flex items-center gap-2 text-[11px] text-cyan-800/95",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "shrink-0",
                                                                    children: "Display"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 1082,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: screenMonitor,
                                                                    onChange: (e)=>setScreenMonitor(Number(e.target.value) || 1),
                                                                    className: "cyber-input max-w-[11rem] py-1 text-xs",
                                                                    children: monitorOptions.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: m.index,
                                                                            children: [
                                                                                m.label,
                                                                                m.width > 0 ? ` (${m.width}×${m.height})` : ''
                                                                            ]
                                                                        }, m.index, true, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 1089,
                                                                            columnNumber: 31
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 1083,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1081,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1056,
                                                    columnNumber: 23
                                                }, this),
                                                screenHint ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs leading-snug text-cyan-700/90",
                                                    children: screenHint
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1097,
                                                    columnNumber: 37
                                                }, this) : null,
                                                screenSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `relative flex min-h-0 w-full flex-1 overflow-hidden rounded-lg border border-cyan-900/35 bg-black/15 ${screenFullscreen ? 'min-h-0 max-h-[calc(100dvh-9rem)] flex-1 sm:max-h-[calc(100dvh-7rem)]' : 'min-h-[min(360px,calc(100dvh-20rem))] flex-1'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: screenSrc,
                                                            alt: "Desktop snapshot",
                                                            className: "mx-auto block h-full w-full max-h-full cursor-crosshair object-contain",
                                                            onClick: onScreenClick
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1105,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-3 pb-2 pt-10 text-left text-[10px] leading-snug text-cyan-200/80",
                                                            children: "Same-screen tunnel effect is normal — switch display or use another device."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1111,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1099,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex flex-1 items-center justify-center rounded-lg border border-dashed border-cyan-900/40 px-4 text-center text-sm text-cyan-800/90 ${screenFullscreen ? 'min-h-[40vh]' : 'min-h-[min(200px,calc(100dvh-22rem))]'}`,
                                                    children: liveDesktop ? 'Waiting for frames… check agent (mss/Pillow) and API.' : 'Start live or take a snapshot — click image to focus a window.'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1116,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 1052,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1051,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 747,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 746,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 745,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 740,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-h-0 min-w-0 flex-1 flex-col gap-2 px-2 pb-3 pt-2 md:px-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "cyber-panel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex shrink-0 items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setTerminalFocus(false),
                                        className: "cyber-btn cyber-btn-ghost flex items-center gap-1 px-3 py-1.5 text-xs font-semibold md:text-sm",
                                        children: "← Back to Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1135,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-cyan-600/75",
                                        children: "Terminal workspace"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1142,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1134,
                                columnNumber: 15
                            }, this),
                            accountLine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-1 shrink-0 bg-gradient-to-r from-cyan-200 to-emerald-200 bg-clip-text text-[12px] font-semibold text-transparent",
                                children: accountLine
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1145,
                                columnNumber: 17
                            }, this) : null,
                            machineLine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-2 shrink-0 text-[10px] leading-snug text-cyan-600/90",
                                children: machineLine
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1150,
                                columnNumber: 17
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex shrink-0 gap-1 rounded-xl border border-cyan-500/25 bg-black/50 p-1 ring-1 ring-emerald-500/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShellTab('cmd'),
                                        className: `flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all md:text-sm ${shellTab === 'cmd' ? 'border border-cyan-400/40 bg-cyan-500/20 text-cyan-50 shadow-[0_0_20px_rgba(0,240,255,0.15)]' : 'text-cyan-200/50 hover:text-cyan-100'}`,
                                        children: "CMD"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1153,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShellTab('powershell'),
                                        className: `flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all md:text-sm ${shellTab === 'powershell' ? 'border border-emerald-400/40 bg-emerald-500/15 text-emerald-50 shadow-[0_0_20px_rgba(57,255,20,0.12)]' : 'text-emerald-200/50 hover:text-emerald-100'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex flex-wrap items-center justify-center gap-2",
                                            children: [
                                                "PowerShell",
                                                agentElevated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded border border-rose-500/50 bg-rose-950/80 px-1.5 text-[9px] font-semibold text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.35)]",
                                                    children: "[ADMIN]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1174,
                                                    columnNumber: 23
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 1171,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1163,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1152,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex min-h-0 flex-1 flex-col",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TerminalPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    socket: socket,
                                    conn: conn,
                                    portalRequest: portalRequest,
                                    shell: shellTab === 'cmd' ? 'cmd' : 'powershell',
                                    title: shellTab === 'cmd' ? 'CMD' : 'PowerShell',
                                    accountLine: accountLine,
                                    machineLine: machineLine,
                                    agentElevated: agentElevated,
                                    hideChrome: true,
                                    isActive: true
                                }, `${selectedMachineId ?? 'none'}-${shellTab}`, false, {
                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                    lineNumber: 1182,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1181,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 1133,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 1132,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                lineNumber: 738,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ConsoleDashboard.tsx",
        lineNumber: 629,
        columnNumber: 5
    }, this);
}
_s(ConsoleDashboard, "efopQG2Rj2I2NabpLP2I4wkf/KY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useConsoleSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsoleSocket"]
    ];
});
_c = ConsoleDashboard;
var _c;
__turbopack_context__.k.register(_c, "ConsoleDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.mjs [app-client] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/network.mjs [app-client] (ecmascript) <export default as Network>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.mjs [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.mjs [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BinaryRain$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BinaryRain.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConsoleDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ConsoleDashboard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Dashboard() {
    _s();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showConsole, setShowConsole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const openConsoleFullscreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Dashboard.useCallback[openConsoleFullscreen]": ()=>{
            if (typeof document === 'undefined') return;
            void ({
                "Dashboard.useCallback[openConsoleFullscreen]": async ()=>{
                    try {
                        const el = document.documentElement;
                        if (document.fullscreenElement !== el) {
                            await el.requestFullscreen();
                        }
                    } catch  {
                    /* Browser may block without gesture; console still opens */ }
                    setShowConsole(true);
                }
            })["Dashboard.useCallback[openConsoleFullscreen]"]();
        }
    }["Dashboard.useCallback[openConsoleFullscreen]"], []);
    const quickTools = [
        {
            id: 'terminal',
            label: 'Terminal',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"],
            desc: 'Interactive shell access',
            color: 'cyan'
        },
        {
            id: 'shield',
            label: 'Security',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
            desc: 'System security audit',
            color: 'emerald'
        },
        {
            id: 'zap',
            label: 'Performance',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
            desc: 'Real-time metrics',
            color: 'amber'
        },
        {
            id: 'network',
            label: 'Network',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"],
            desc: 'Network diagnostics',
            color: 'blue'
        },
        {
            id: 'database',
            label: 'Storage',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"],
            desc: 'Disk & storage info',
            color: 'purple'
        },
        {
            id: 'settings',
            label: 'System',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
            desc: 'System configuration',
            color: 'rose'
        }
    ];
    const filteredTools = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Dashboard.useMemo[filteredTools]": ()=>{
            if (!searchQuery.trim()) return quickTools;
            return quickTools.filter({
                "Dashboard.useMemo[filteredTools]": (tool)=>tool.label.toLowerCase().includes(searchQuery.toLowerCase()) || tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
            }["Dashboard.useMemo[filteredTools]"]);
        }
    }["Dashboard.useMemo[filteredTools]"], [
        searchQuery
    ]);
    if (showConsole) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConsoleDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/components/dashboard.tsx",
            lineNumber: 94,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen w-full bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BinaryRain$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-0 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse z-0"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-0 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse z-0"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 pointer-events-none z-[1] matrix-scanlines opacity-[0.06]"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-[2] flex flex-col min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "border-b border-cyan-500/20 backdrop-blur-xl bg-black/40 sticky top-0 z-40 shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between gap-4 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                className: "w-5 h-5 text-cyan-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 120,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/dashboard.tsx",
                                                            lineNumber: 119,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                            className: "text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent tracking-tight",
                                                            children: "NEXUS INTELLIGENCE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/dashboard.tsx",
                                                            lineNumber: 122,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm md:text-base text-cyan-200/70 ml-11 font-light tracking-wide",
                                                    children: "Unified AI control system for real-time automation, analysis, and command execution."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 px-3 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                    className: "w-4 h-4 text-emerald-400 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-semibold text-emerald-300",
                                                    children: "ONLINE"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "absolute left-3 top-3 w-4 h-4 text-cyan-500/60"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 138,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Search tools & capabilities... (terminal, security, network, storage)",
                                            value: searchQuery,
                                            onChange: (e)=>setSearchQuery(e.target.value),
                                            className: "w-full pl-10 pr-4 py-2.5 bg-black/40 border border-cyan-500/30 rounded-lg text-cyan-50 placeholder:text-cyan-700/60 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 139,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "group p-4 rounded-xl border border-cyan-500/20 bg-black/40 hover:bg-cyan-500/5 transition-all duration-300 cursor-default",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold uppercase tracking-wider text-cyan-400/80",
                                                        children: "System Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 155,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-cyan-200 mb-1",
                                                children: "OPERATIONAL"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 161,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-cyan-700/80",
                                                children: "All systems nominal"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 162,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "group p-4 rounded-xl border border-emerald-500/20 bg-black/40 hover:bg-emerald-500/5 transition-all duration-300 cursor-default",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold uppercase tracking-wider text-emerald-400/80",
                                                        children: "Active Sessions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                        className: "w-4 h-4 text-emerald-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 166,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-emerald-200 mb-1",
                                                children: "—"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 172,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-emerald-700/80",
                                                children: "Open console to see agents"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 173,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "group p-4 rounded-xl border border-amber-500/20 bg-black/40 hover:bg-amber-500/5 transition-all duration-300 cursor-default",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold uppercase tracking-wider text-amber-400/80",
                                                        children: "Network Uptime"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                        className: "w-4 h-4 text-amber-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 177,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-amber-200 mb-1",
                                                children: "99.8%"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 183,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-amber-700/80",
                                                children: "Secure connection"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 184,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 176,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent tracking-tight mb-2",
                                            children: "Quick Access Tools"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this),
                                    filteredTools.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                        children: filteredTools.map((tool)=>{
                                            const Icon = tool.icon;
                                            const colorClasses = {
                                                cyan: 'border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]',
                                                emerald: 'border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]',
                                                amber: 'border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-500/10 hover:shadow-[0_0_20px_rgba(217,119,6,0.1)]',
                                                blue: 'border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]',
                                                purple: 'border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]',
                                                rose: 'border-rose-500/30 hover:border-rose-400/60 hover:bg-rose-500/10 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]'
                                            };
                                            const iconColorClasses = {
                                                cyan: 'text-cyan-400',
                                                emerald: 'text-emerald-400',
                                                amber: 'text-amber-400',
                                                blue: 'text-blue-400',
                                                purple: 'text-purple-400',
                                                rose: 'text-rose-400'
                                            };
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>openConsoleFullscreen(),
                                                className: `group/card relative p-5 rounded-xl border bg-black/30 transition-all duration-300 text-left overflow-hidden ${colorClasses[tool.color]}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover/card:from-white/5 group-hover/card:to-white/0 transition-all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start justify-between mb-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `p-2 rounded-lg bg-black/50 ${iconColorClasses[tool.color]}`,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                            className: "w-5 h-5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/dashboard.tsx",
                                                                            lineNumber: 230,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                                        lineNumber: 229,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                        className: "w-4 h-4 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                                        lineNumber: 232,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 228,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-base font-bold text-white mb-1",
                                                                children: tool.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 234,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-cyan-200/60 mb-3",
                                                                children: tool.desc
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 235,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1 text-xs font-semibold text-cyan-400 opacity-0 group-hover/card:opacity-100 transition-opacity",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                        className: "w-3 h-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                                        lineNumber: 237,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " Access tool"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 236,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, tool.id, true, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 221,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-8 rounded-xl border border-cyan-500/20 bg-black/30 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-cyan-700/80 text-sm",
                                            children: [
                                                'No tools match "',
                                                searchQuery,
                                                '". Try another search or clear to see all.'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 246,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>openConsoleFullscreen(),
                                    className: "w-full group relative px-6 py-4 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-white/5 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-white/10 group-hover:to-emerald-500/10 transition-all"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 259,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex items-center justify-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                                    className: "w-5 h-5 text-emerald-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-base font-bold text-emerald-200",
                                                    children: "Launch Full Console Workspace"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    className: "w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 260,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard.tsx",
                                    lineNumber: 255,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-8 border-t border-cyan-500/10 text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-cyan-700/70 tracking-wide",
                                    children: [
                                        "NEXUS INTELLIGENCE v1.0 • Advanced system control interface • ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-emerald-400",
                                            children: "Secured"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 273,
                                            columnNumber: 77
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_s(Dashboard, "8mAgBGsqn10yM1gfSWyXgQtwgyk=");
_c = Dashboard;
var _c;
__turbopack_context__.k.register(_c, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard.tsx [app-client] (ecmascript)");
'use client';
;
;
function HomePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0wih17w._.js.map