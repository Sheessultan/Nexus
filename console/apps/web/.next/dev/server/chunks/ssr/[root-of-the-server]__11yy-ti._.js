module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/src/hooks/useConsoleSocket.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm-debug/index.js [app-ssr] (ecmascript) <locals>");
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
    const pageHost = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '';
    const direct = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
    if (direct) {
        return rewriteLoopbackApiUrlForPage(direct, pageHost);
    }
    const origin = process.env.NEXT_PUBLIC_API_ORIGIN?.trim().replace(/\/+$/, '');
    if (origin) {
        const o = rewriteLoopbackApiUrlForPage(origin, pageHost);
        return `${o}/console`;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return 'http://localhost:4000/console';
}
const CONSOLE_SOCKET_PROXY_ENGINE_PATH = '/console-socket/socket.io';
/**
 * When the UI is on :3000 and the API on :4000 on a **LAN hostname**, the browser treats that as
 * cross-origin; proxying Engine.IO through Next fixes that.
 * On **loopback** (localhost / 127.0.0.1), connect **directly** to :4000 — the proxy can hang in Edge InPrivate.
 */ function getConsoleSocketIoParams() {
    const directUrl = getConsoleSocketUrl();
    if ("TURBOPACK compile-time truthy", 1) {
        return {
            url: directUrl,
            path: '/socket.io',
            transports: [
                'websocket',
                'polling'
            ]
        };
    }
    //TURBOPACK unreachable
    ;
    const pageOrigin = undefined;
    const pageHost = undefined;
    const pageIsLoopback = undefined;
}
const PORTAL_TIMEOUT_MS = 30_000;
function useConsoleSocket() {
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [socket, setSocket] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [conn, setConn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [agentReady, setAgentReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pendingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const { url, path, transports } = getConsoleSocketIoParams();
        const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(url, {
            path,
            transports,
            timeout: 45_000,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10_000
        });
        const onPortal = (msg)=>{
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
        };
        const onLog = (msg)=>{
            const line = msg?.line ?? '';
            if (line.includes('Agent registered')) {
                setAgentReady(true);
            }
            if (line.includes('Agent disconnected')) {
                setAgentReady(false);
            }
        };
        s.on('connect', ()=>{
            socketRef.current = s;
            setSocket(s);
            setConn('open');
        });
        s.on('disconnect', ()=>{
            setConn('idle');
            setAgentReady(false);
        });
        const onAgentReady = ()=>setAgentReady(true);
        s.on('log:line', onLog);
        s.on('agent:ready', onAgentReady);
        s.on('connect_error', ()=>{
            setConn('error');
        });
        s.on('portal:result', onPortal);
        setConn('connecting');
        return ()=>{
            s.off('portal:result', onPortal);
            s.off('log:line', onLog);
            s.off('agent:ready', onAgentReady);
            s.disconnect();
            socketRef.current = null;
            pendingRef.current.clear();
            setSocket(null);
            setConn('idle');
            setAgentReady(false);
        };
    }, []);
    const portalRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type, payload)=>{
        const s = socketRef.current;
        if (!s?.connected) {
            return Promise.reject(new Error('Socket not connected'));
        }
        const requestId = crypto.randomUUID();
        return new Promise((resolve, reject)=>{
            const timer = setTimeout(()=>{
                if (!pendingRef.current.has(requestId)) return;
                pendingRef.current.delete(requestId);
                reject(new Error('Portal request timed out. Start the Windows agent (`py src\\main.py --api http://YOUR_IP:4000`) and click Retry.'));
            }, PORTAL_TIMEOUT_MS);
            pendingRef.current.set(requestId, {
                resolve: (v)=>{
                    clearTimeout(timer);
                    resolve(v);
                },
                reject: (e)=>{
                    clearTimeout(timer);
                    reject(e);
                }
            });
            s.emit('portal:request', {
                requestId,
                type,
                payload
            });
        });
    }, []);
    return {
        socket,
        conn,
        agentReady,
        portalRequest
    };
}
}),
"[project]/src/lib/stripPsClixml.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/components/TerminalPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TerminalPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$fit$2f$lib$2f$addon$2d$fit$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/addon-fit/lib/addon-fit.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$unicode11$2f$lib$2f$addon$2d$unicode11$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/addon-unicode11/lib/addon-unicode11.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$web$2d$links$2f$lib$2f$addon$2d$web$2d$links$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/addon-web-links/lib/addon-web-links.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$xterm$2f$lib$2f$xterm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@xterm/xterm/lib/xterm.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stripPsClixml$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/stripPsClixml.ts [app-ssr] (ecmascript)");
'use client';
;
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
    const hostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const termRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fitRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sessionIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isActiveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(isActive);
    const resizeTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    isActiveRef.current = isActive;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket) return;
        const el = hostRef.current;
        if (!el) return;
        const term = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$xterm$2f$lib$2f$xterm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Terminal"]({
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
        const unicode11 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$unicode11$2f$lib$2f$addon$2d$unicode11$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Unicode11Addon"]();
        term.loadAddon(unicode11);
        term.unicode.activeVersion = '11';
        const webLinks = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$web$2d$links$2f$lib$2f$addon$2d$web$2d$links$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WebLinksAddon"]((ev, uri)=>{
            ev.preventDefault();
            window.open(uri, '_blank', 'noopener,noreferrer');
        });
        term.loadAddon(webLinks);
        const fit = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$xterm$2f$addon$2d$fit$2f$lib$2f$addon$2d$fit$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FitAddon"]();
        term.loadAddon(fit);
        term.open(el);
        fit.fit();
        const stopPty = ()=>{
            const sid = sessionIdRef.current;
            sessionIdRef.current = null;
            if (sid && socket.connected) {
                socket.emit('pty:close', {
                    sessionId: sid
                });
            }
        };
        const startPty = ()=>{
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
        };
        const emitResize = ()=>{
            const sid = sessionIdRef.current;
            if (!sid || !socket.connected) return;
            socket.emit('pty:resize', {
                sessionId: sid,
                rows: term.rows,
                cols: term.cols
            });
        };
        const scheduleResize = ()=>{
            if (!isActiveRef.current) return;
            fit.fit();
            if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
            resizeTimerRef.current = setTimeout(()=>{
                resizeTimerRef.current = null;
                emitResize();
            }, 80);
        };
        const paintBanner = async ()=>{
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
        };
        const onPtyOut = (msg)=>{
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
                data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stripPsClixml$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stripPsClixmlNoise"])(data);
            }
            term.write(data);
        };
        const onConnect = ()=>{
            void (async ()=>{
                await paintBanner();
                startPty();
            })();
        };
        const onDisconnect = ()=>{
            stopPty();
            term.writeln('\r\n\x1b[31mSocket disconnected.\x1b[0m\r\n');
        };
        const onLog = (msg)=>{
            term.writeln(`\x1b[33m${msg?.line ?? ''}\x1b[0m`);
        };
        /** One-shot `agent:shell_exec` + multiline PS continuation (`>>`) from the gateway. */ const onLineShellOut = (msg)=>{
            const sh = msg.shell === 'cmd' ? 'cmd' : 'powershell';
            const panel = shell === 'cmd' ? 'cmd' : 'powershell';
            if (sh !== panel) return;
            let data = msg.data ?? '';
            if (shell !== 'cmd') {
                data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stripPsClixml$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stripPsClixmlNoise"])(data);
            }
            term.write(data);
        };
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('pty:output', onPtyOut);
        socket.on('terminal:output', onLineShellOut);
        socket.on('log:line', onLog);
        term.onData((data)=>{
            const sid = sessionIdRef.current;
            if (!sid || !socket.connected) return;
            socket.emit('pty:input', {
                sessionId: sid,
                data
            });
        });
        const pasteFromClipboard = ()=>{
            if (!navigator.clipboard?.readText) {
                term.writeln('\r\n\x1b[33mClipboard API unavailable — use HTTPS or localhost.\x1b[0m\r\n');
                return;
            }
            void navigator.clipboard.readText().then((t)=>{
                if (t) {
                    const sid = sessionIdRef.current;
                    if (sid && socket.connected) {
                        socket.emit('pty:input', {
                            sessionId: sid,
                            data: t
                        });
                    }
                }
            }, ()=>{
                term.writeln('\r\n\x1b[33mPaste blocked by the browser — click inside the terminal and try Ctrl+Shift+V.\x1b[0m\r\n');
            });
        };
        term.attachCustomKeyEventHandler((e)=>{
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
                    void navigator.clipboard.writeText(sel).catch(()=>{});
                    return false;
                }
            }
            return true;
        });
        const onPasteDom = (ev)=>{
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
        };
        const root = term.element;
        if (root) {
            root.addEventListener('paste', onPasteDom, true);
        }
        const ro = new ResizeObserver(()=>{
            if (isActiveRef.current) {
                scheduleResize();
            }
        });
        ro.observe(el);
        termRef.current = term;
        fitRef.current = fit;
        if (socket.connected) {
            void (async ()=>{
                await paintBanner();
                startPty();
            })();
        }
        return ()=>{
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
        };
    }, [
        socket,
        portalRequest,
        shell,
        accountLine,
        machineLine,
        agentElevated,
        hideChrome
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isActive || !fitRef.current) return;
        const id = requestAnimationFrame(()=>{
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
        });
        return ()=>cancelAnimationFrame(id);
    }, [
        isActive,
        socket
    ]);
    const badge = conn === 'open' ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40' : conn === 'error' ? 'bg-rose-500/15 text-rose-300 ring-rose-500/40' : 'bg-cyan-500/15 text-cyan-200 ring-cyan-500/35';
    const shellBadge = shell === 'cmd' ? 'cmd.exe' : shell === 'powershell_admin' ? 'powershell (admin tab)' : 'powershell';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex h-full min-h-[280px] flex-col gap-2 rounded-xl border border-cyan-500/20 bg-zinc-950/25 p-2 shadow-[0_0_40px_rgba(0,240,255,0.06)] ring-1 ring-emerald-400/10 backdrop-blur-md",
        children: [
            !socket ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/80 text-sm text-cyan-200/90",
                children: "API connecting…"
            }, void 0, false, {
                fileName: "[project]/src/components/TerminalPanel.tsx",
                lineNumber: 379,
                columnNumber: 9
            }, this) : null,
            !hideChrome ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1 border-b border-cyan-500/20 pb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "bg-gradient-to-r from-cyan-200 to-emerald-300 bg-clip-text font-mono text-sm font-semibold tracking-wide text-transparent",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/TerminalPanel.tsx",
                                lineNumber: 386,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded border border-cyan-500/40 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-cyan-200",
                                children: shellBadge
                            }, void 0, false, {
                                fileName: "[project]/src/components/TerminalPanel.tsx",
                                lineNumber: 389,
                                columnNumber: 13
                            }, this),
                            shell === 'powershell_admin' || shell === 'powershell' && agentElevated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded border border-rose-500/50 bg-rose-950/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.35)]",
                                children: "[ADMIN]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/TerminalPanel.tsx",
                                lineNumber: 393,
                                columnNumber: 15
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    accountLine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[11px] font-medium leading-snug text-emerald-200/95",
                        children: accountLine
                    }, void 0, false, {
                        fileName: "[project]/src/components/TerminalPanel.tsx",
                        lineNumber: 404,
                        columnNumber: 13
                    }, this) : null,
                    machineLine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
}),
"[project]/src/data/windowsQuickTools.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/components/QuickToolsPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuickToolsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$windowsQuickTools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/windowsQuickTools.ts [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "cyber-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[11px] leading-relaxed text-cyan-800/90",
                children: [
                    "One-shot commands on the agent (",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
            !socket?.connected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-cyan-600/90",
                children: "Waiting for socket…"
            }, void 0, false, {
                fileName: "[project]/src/components/QuickToolsPanel.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this) : null,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$windowsQuickTools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WINDOWS_QUICK_TOOL_GROUPS"].map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-cyan-900/35 bg-black/35 p-2 ring-1 ring-cyan-500/10 transition-shadow duration-200 hover:shadow-[0_0_20px_rgba(0,240,255,0.06)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "mb-2 border-b border-cyan-950/60 pb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-400/90",
                            children: g.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuickToolsPanel.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-1.5",
                            children: g.tools.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    disabled: conn !== 'open' || !socket?.connected,
                                    title: t.command,
                                    onClick: ()=>run(t.shell, t.command),
                                    className: "max-w-full truncate rounded-lg border border-cyan-900/40 bg-black/40 px-2 py-1 text-left text-[11px] font-medium text-cyan-100/90 ring-1 ring-transparent transition-all duration-200 hover:border-cyan-500/45 hover:shadow-[0_0_12px_rgba(0,240,255,0.1)] disabled:cursor-not-allowed disabled:opacity-35",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/src/components/ConsoleDashboard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConsoleDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-open.mjs [app-ssr] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hard-drive.mjs [app-ssr] (ecmascript) <export default as HardDrive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.mjs [app-ssr] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-ssr] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.mjs [app-ssr] (ecmascript) <export default as Minimize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2d$dot$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MonitorDot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/monitor-dot.mjs [app-ssr] (ecmascript) <export default as MonitorDot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.mjs [app-ssr] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wrench.mjs [app-ssr] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useConsoleSocket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useConsoleSocket.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TerminalPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TerminalPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuickToolsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/QuickToolsPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard.tsx [app-ssr] (ecmascript)");
'use client';
;
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
function ConsoleDashboard() {
    const { socket, conn, agentReady, portalRequest } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useConsoleSocket$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConsoleSocket"])();
    const [path, setPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [dirLoading, setDirLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [drives, setDrives] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [entries, setEntries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [explorerError, setExplorerError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [appsTab, setAppsTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('installed');
    const [installed, setInstalled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [startMenu, setStartMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [appQuery, setAppQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [screenSrc, setScreenSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [screenMeta, setScreenMeta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [screenHint, setScreenHint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [accountLine, setAccountLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [machineLine, setMachineLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [liveDesktop, setLiveDesktop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    /** mss monitor index: 1 = first physical display (see python mss monitors). */ const [screenMonitor, setScreenMonitor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const screenMonitorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(screenMonitor);
    screenMonitorRef.current = screenMonitor;
    const lastFrameSeq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const liveWatchdog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const gotLiveFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const liveNoFrameNotified = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const screenViewerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [screenFullscreen, setScreenFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [monitorOptions, setMonitorOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            index: 1,
            width: 0,
            height: 0,
            label: 'Display 1'
        }
    ]);
    const autoMonitorPickDone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [shellTab, setShellTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('powershell');
    const [agentElevated, setAgentElevated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [leftTab, setLeftTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('explorer');
    const terminalSectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [sideLog, setSideLog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [terminalFocus, setTerminalFocus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileNavOpen, setMobileNavOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tabHeapMb, setTabHeapMb] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const refreshSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
    }, [
        portalRequest
    ]);
    const refreshDrives = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            setExplorerError(null);
            const raw = await portalRequest('list_drives');
            const list = parseJson(raw);
            setDrives(Array.isArray(list) ? list : []);
        } catch (e) {
            setDrives([]);
            setExplorerError(e instanceof Error ? e.message : String(e));
        }
    }, [
        portalRequest
    ]);
    const refreshDir = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (p)=>{
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
    }, [
        portalRequest
    ]);
    const refreshApps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
    }, [
        portalRequest
    ]);
    const captureScreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (opts)=>{
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
    }, [
        portalRequest,
        screenMonitor
    ]);
    const reloadAgentData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        await refreshDrives();
        setEntries([]);
        await refreshApps();
        await refreshSession();
    }, [
        refreshDrives,
        refreshApps,
        refreshSession
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket || conn !== 'open') return;
        void reloadAgentData();
    }, [
        socket,
        conn,
        reloadAgentData
    ]);
    /** Browser often connects before the Windows agent registers — retry when agent comes online. */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket || conn !== 'open' || !agentReady) return;
        void reloadAgentData();
    }, [
        socket,
        conn,
        agentReady,
        reloadAgentData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket || conn !== 'open' || agentReady) return;
        const t = window.setInterval(()=>{
            void reloadAgentData();
        }, 4000);
        return ()=>window.clearInterval(t);
    }, [
        socket,
        conn,
        agentReady,
        reloadAgentData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket) return;
        void (async ()=>{
            try {
                const raw = await portalRequest('list_monitors_json');
                const rows = parseJson(raw);
                if (!Array.isArray(rows) || rows.length === 0) return;
                setMonitorOptions(rows);
                if (rows.length >= 2 && !autoMonitorPickDone.current) {
                    autoMonitorPickDone.current = true;
                    setScreenMonitor(2);
                } else {
                    setScreenMonitor((m)=>rows.some((r)=>r.index === m) ? m : rows[0].index);
                }
            } catch  {
            /* agent older than list_monitors_json — keep 1..4 UI */ }
        })();
    }, [
        socket,
        portalRequest
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket) return;
        const onSockErr = (e)=>{
            setScreenHint((prev)=>prev ?? `Socket error: ${e.message}`);
        };
        socket.on('connect_error', onSockErr);
        return ()=>{
            socket.off('connect_error', onSockErr);
        };
    }, [
        socket
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onFs = ()=>{
            setScreenFullscreen(document.fullscreenElement === screenViewerRef.current);
        };
        document.addEventListener('fullscreenchange', onFs);
        return ()=>document.removeEventListener('fullscreenchange', onFs);
    }, []);
    const toggleScreenFullscreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket) return;
        const onFrame = (body)=>{
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
        };
        if (liveDesktop) {
            lastFrameSeq.current = 0;
            gotLiveFrame.current = false;
            liveNoFrameNotified.current = false;
            socket.on('screen:frame', onFrame);
            void (async ()=>{
                try {
                    const dbg = await portalRequest('screen_debug', {
                        monitor: screenMonitorRef.current
                    });
                    const j = parseJson(dbg);
                    setScreenHint(`Screen check: mss=${String(j.hasMss)} pillow=${String(j.hasPillow)} capture=${String(j.captureOk)} mon=${String(j.monitor ?? screenMonitorRef.current)} ` + (j.captureError ? `err=${j.captureError} ` : '') + (j.jpegChars != null ? `jpeg~${j.jpegChars} chars` : ''));
                } catch (e) {
                    setScreenHint(e instanceof Error ? e.message : String(e));
                }
            })();
            setTimeout(()=>{
                void captureScreen({
                    preserveHint: true
                });
            }, 200);
            liveWatchdog.current = setInterval(()=>{
                if (!gotLiveFrame.current && !liveNoFrameNotified.current) {
                    liveNoFrameNotified.current = true;
                    setScreenHint((h)=>`${h ?? ''} | No live frames yet — check agent (mss/Pillow) and API.`);
                }
            }, 7000);
            return ()=>{
                if (liveWatchdog.current) {
                    clearInterval(liveWatchdog.current);
                    liveWatchdog.current = null;
                }
                socket.emit('screen:control', {
                    action: 'stop'
                });
                socket.off('screen:frame', onFrame);
            };
        }
        return undefined;
    }, [
        socket,
        liveDesktop,
        portalRequest,
        captureScreen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!socket?.connected || !liveDesktop) return;
        socket.emit('screen:control', {
            action: 'start',
            fps: 4,
            monitor: screenMonitor
        });
    }, [
        socket,
        liveDesktop,
        screenMonitor
    ]);
    const breadcrumb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
    }, [
        path
    ]);
    const filteredInstalled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const q = appQuery.trim().toLowerCase();
        if (!q) return installed;
        return installed.filter((a)=>(a.name || '').toLowerCase().includes(q));
    }, [
        installed,
        appQuery
    ]);
    const filteredStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const q = appQuery.trim().toLowerCase();
        if (!q) return startMenu;
        return startMenu.filter((a)=>(a.name || '').toLowerCase().includes(q));
    }, [
        startMenu,
        appQuery
    ]);
    const filteredEntries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!path.trim()) return [];
        const q = appQuery.trim().toLowerCase();
        if (!q) return entries;
        return entries.filter((e)=>e.name.toLowerCase().includes(q));
    }, [
        path,
        entries,
        appQuery
    ]);
    const drivesEmpty = drives.length === 0;
    const onScreenClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (e)=>{
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
    }, [
        portalRequest,
        screenMeta
    ]);
    const runSidePortal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (type, payload)=>{
        setSideLog('…');
        try {
            const raw = await portalRequest(type, payload);
            setSideLog(String(raw).slice(0, 16000));
        } catch (e) {
            setSideLog(e instanceof Error ? e.message : String(e));
        }
    }, [
        portalRequest
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const tick = ()=>{
            const perf = performance;
            if (perf.memory) setTabHeapMb(Math.round(perf.memory.usedJSHeapSize / 1024 / 1024));
        };
        tick();
        const id = window.setInterval(tick, 4000);
        return ()=>window.clearInterval(id);
    }, []);
    const closeMobileNav = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setMobileNavOpen(false), []);
    const renderSidebarNav = (opts)=>{
        const { compact, onPick } = opts;
        const pick = ()=>{
            onPick?.();
        };
        const navBtn = (active, extra)=>`${compact ? 'flex h-10 w-10 items-center justify-center rounded-lg p-0' : 'cyber-nav-btn'} ${active ? 'cyber-nav-btn-active border-cyan-400/45' : ''} ${extra}`;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `cyber-panel flex flex-col ${compact ? 'items-center gap-1 p-1.5' : 'gap-1 p-2'}`,
            children: [
                !compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "border-b border-cyan-500/25 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90",
                    children: "Console"
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 473,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Dashboard",
                    className: navBtn(leftTab === 'dashboard', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('dashboard');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 486,
                        columnNumber: 22
                    }, this) : 'Dashboard'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 477,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Drives / Explorer",
                    className: navBtn(leftTab === 'explorer', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('explorer');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 497,
                        columnNumber: 22
                    }, this) : 'Drives / Explorer'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 488,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Programs",
                    className: navBtn(leftTab === 'apps', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('apps');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 508,
                        columnNumber: 22
                    }, this) : 'Programs'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 499,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Desktop stream",
                    className: navBtn(leftTab === 'screen', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('screen');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2d$dot$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MonitorDot$3e$__["MonitorDot"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 519,
                        columnNumber: 22
                    }, this) : 'Desktop stream'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 510,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Quick tools",
                    className: navBtn(leftTab === 'tools', 'text-cyan-100/85'),
                    onClick: ()=>{
                        setLeftTab('tools');
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"], {
                        className: "h-4 w-4 text-cyan-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 530,
                        columnNumber: 22
                    }, this) : 'Quick tools'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 521,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Terminal workspace",
                    className: navBtn(false, 'mt-1 border border-cyan-800/50 text-cyan-200/90 hover:border-cyan-500/40'),
                    onClick: ()=>{
                        setTerminalFocus(true);
                        setMobileNavOpen(false);
                        pick();
                    },
                    children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 542,
                        columnNumber: 22
                    }, this) : 'Terminal workspace'
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 532,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ConsoleDashboard.tsx",
            lineNumber: 471,
            columnNumber: 7
        }, this);
    };
    const renderOpsPanel = (opts)=>{
        if (opts.compact) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cyber-panel flex flex-col items-center p-1.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: "Ops: open quick tools tab",
                    className: "flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-800/40 text-emerald-200/90 hover:border-emerald-500/40",
                    onClick: ()=>{
                        if (terminalFocus) {
                            setTerminalFocus(false);
                        }
                        setLeftTab('tools');
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 563,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 552,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                lineNumber: 551,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "cyber-panel flex max-h-[55vh] min-h-0 flex-1 flex-col gap-1 overflow-hidden p-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "border-b border-emerald-500/25 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/90",
                    children: "Ops"
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 570,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cyber-scroll flex max-h-[42vh] flex-col gap-1 overflow-y-auto pr-1",
                    children: [
                        [
                            [
                                'query_user_sessions',
                                'Users / sessions (query)'
                            ],
                            [
                                'process_list_brief',
                                'Processes'
                            ],
                            [
                                'services_brief',
                                'Services'
                            ],
                            [
                                'startup_entries',
                                'Startup (Run keys)'
                            ],
                            [
                                'net_share_list',
                                'Shares (net)'
                            ],
                            [
                                'firewall_profiles',
                                'Firewall profiles'
                            ],
                            [
                                'network_info',
                                'Network (ipconfig)'
                            ],
                            [
                                'logs_tail',
                                'Event log (sample)'
                            ],
                            [
                                'tasks_list',
                                'Scheduled tasks'
                            ],
                            [
                                'diskpart_list_disk',
                                'Diskpart list disk'
                            ]
                        ].map(([t, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "cyber-nav-btn py-1.5 text-[10px] leading-tight text-emerald-200/85",
                                onClick: ()=>{
                                    if (terminalFocus) {
                                        setTerminalFocus(false);
                                    }
                                    void runSidePortal(t);
                                },
                                children: label
                            }, t, false, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 588,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "cyber-nav-btn py-1.5 text-[10px] text-cyan-200/90",
                            onClick: ()=>{
                                if (terminalFocus) {
                                    setTerminalFocus(false);
                                }
                                void runSidePortal('open_mmc', {
                                    name: 'devmgmt.msc'
                                });
                            },
                            children: "Device Manager"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 602,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 573,
                    columnNumber: 9
                }, this),
                sideLog ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                    className: "cyber-scroll mt-1 max-h-40 shrink-0 overflow-auto rounded-lg border border-emerald-500/20 bg-black/70 p-2 text-[9px] leading-snug text-emerald-100/90",
                    children: sideLog
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 616,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ConsoleDashboard.tsx",
            lineNumber: 569,
            columnNumber: 7
        }, this);
    };
    const sidebarPad = sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-52';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative z-[3] flex w-full flex-col ${terminalFocus ? 'h-dvh min-h-0 overflow-hidden' : 'min-h-full'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed inset-0 z-[2] matrix-scanlines opacity-[0.06]",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                lineNumber: 630,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "fixed top-0 right-0 left-0 z-[500] flex h-14 items-center gap-2 border-b border-cyan-500/20 bg-zinc-950/45 px-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl md:gap-3 md:px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "rounded-lg border border-cyan-800/50 p-2 text-cyan-200 hover:border-cyan-500/40 lg:hidden",
                        "aria-label": "Open navigation",
                        onClick: ()=>setMobileNavOpen((v)=>!v),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 639,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 633,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-sm font-bold tracking-tight text-transparent sm:inline",
                        children: "NEXUS INTELLIGENCE"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 641,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${conn === 'open' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(74,222,128,0.2)]' : conn === 'connecting' ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200' : 'border-rose-500/35 bg-rose-950/40 text-rose-200/90'}`,
                        children: conn === 'open' ? 'Online' : conn === 'connecting' ? 'Connecting' : 'Offline'
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 644,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden min-w-0 truncate text-[10px] text-cyan-700/95 md:inline lg:max-w-[14rem]",
                        children: [
                            shellTab === 'powershell' ? 'PS' : 'CMD',
                            " · ",
                            accountLine ?? '—'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 654,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: appQuery,
                        onChange: (e)=>setAppQuery(e.target.value),
                        placeholder: "Search files & apps…",
                        className: "cyber-input ml-auto min-w-0 max-w-[11rem] flex-1 py-1.5 text-xs sm:max-w-xs",
                        "aria-label": "Search files and applications"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 657,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        title: terminalFocus ? 'Show full dashboard' : 'Terminal fills workspace',
                        className: `cyber-btn shrink-0 px-2 py-1.5 ${terminalFocus ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.3)]' : 'border-cyan-600/40'}`,
                        onClick: ()=>setTerminalFocus((v)=>!v),
                        children: terminalFocus ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 673,
                            columnNumber: 28
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 673,
                            columnNumber: 64
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 664,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        title: sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar',
                        className: "cyber-btn cyber-btn-ghost hidden shrink-0 px-2 py-1.5 lg:inline-flex",
                        onClick: ()=>setSidebarCollapsed((c)=>!c),
                        children: sidebarCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 681,
                            columnNumber: 31
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 681,
                            columnNumber: 70
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 675,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden shrink-0 text-[9px] text-cyan-800/90 xl:inline",
                        title: "Browser tab JS heap (approx.)",
                        children: [
                            "RAM ~",
                            tabHeapMb != null ? `${tabHeapMb} MB` : '—'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 683,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                lineNumber: 632,
                columnNumber: 7
            }, this),
            mobileNavOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "fixed inset-0 z-[498] bg-black/55 backdrop-blur-sm lg:hidden",
                        "aria-label": "Close menu",
                        onClick: closeMobileNav
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 690,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
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
                        lineNumber: 696,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
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
                lineNumber: 703,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative flex min-h-0 flex-1 flex-col ${sidebarPad} pt-14`,
                children: !terminalFocus ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex w-full max-w-[1920px] min-w-0 flex-1 flex-col gap-4 px-3 pb-8 pt-4 md:px-5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid flex-1 grid-cols-1 items-stretch gap-4 min-h-[calc(100dvh-9rem)] lg:min-h-[calc(100dvh-8.5rem)] lg:grid-cols-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "flex min-h-0 flex-col gap-3 lg:col-span-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
                                value: leftTab,
                                onValueChange: (v)=>setLeftTab(v),
                                className: "cyber-panel flex min-h-[min(480px,calc(100dvh-10rem))] flex-1 flex-col overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["List"], {
                                        className: "flex shrink-0 flex-wrap gap-1 border-b border-cyan-500/20 bg-black/40 p-1 lg:hidden",
                                        children: [
                                            'dashboard',
                                            'explorer',
                                            'apps',
                                            'screen',
                                            'tools'
                                        ].map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
                                                value: v,
                                                className: "min-w-0 flex-1 rounded-md px-2 py-2 text-xs font-medium text-cyan-200/50 transition-colors data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-50 data-[state=active]:shadow-[0_0_16px_rgba(0,240,255,0.12)] md:px-3 md:text-sm",
                                                children: v === 'dashboard' ? 'Dashboard' : v === 'explorer' ? 'Drives & files' : v === 'apps' ? 'Programs' : v === 'screen' ? 'Desktop view' : 'Quick tools'
                                            }, v, false, {
                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                lineNumber: 727,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 725,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "dashboard",
                                        className: "flex flex-1 flex-col p-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 746,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 745,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "explorer",
                                        className: "flex min-h-0 flex-1 flex-col gap-2 p-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex min-h-0 flex-1 flex-col gap-3 ${drivesEmpty ? '' : 'lg:flex-row'}`,
                                            children: [
                                                !drivesEmpty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                                    className: "flex shrink-0 flex-col gap-2 overflow-x-auto pb-1 lg:w-48 lg:min-w-[11rem] lg:flex-shrink-0 lg:overflow-y-auto lg:pb-0 lg:pr-1",
                                                    "aria-label": "Drives",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-2 px-0.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-600/90 lg:block",
                                                                    children: "This PC"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 757,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>void refreshDrives(),
                                                                    className: "cyber-btn shrink-0 px-2 py-1 text-[10px] lg:px-1.5",
                                                                    title: "Reload drive list",
                                                                    children: "Refresh"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 760,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 756,
                                                            columnNumber: 27
                                                        }, this),
                                                        path.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                            lineNumber: 770,
                                                            columnNumber: 29
                                                        }, this) : null,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2 overflow-x-auto lg:flex-col lg:overflow-x-visible lg:gap-1.5",
                                                            children: drives.map((d)=>{
                                                                const root = d.path.replace(/[/\\]+$/, '').toUpperCase();
                                                                const cur = path.replace(/[/\\]+$/, '').toUpperCase();
                                                                const active = cur === root || cur.startsWith(`${root}\\`);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "flex items-center gap-1.5 text-[11px] font-semibold tracking-tight",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$drive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HardDrive$3e$__["HardDrive"], {
                                                                                    className: "h-3.5 w-3.5 shrink-0 text-cyan-400/90",
                                                                                    "aria-hidden": true
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                    lineNumber: 811,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                d.letter,
                                                                                ": ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-normal text-cyan-700/90",
                                                                                    children: "Local Disk"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                    lineNumber: 812,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 810,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        d.freeGb != null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "pl-5 text-[10px] text-zinc-500",
                                                                            children: [
                                                                                d.freeGb,
                                                                                " GB free"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 815,
                                                                            columnNumber: 37
                                                                        }, this) : null
                                                                    ]
                                                                }, d.letter, true, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 794,
                                                                    columnNumber: 33
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 788,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 752,
                                                    columnNumber: 25
                                                }, this) : null,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex min-h-0 min-w-0 flex-1 flex-col",
                                                    children: !path.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border border-cyan-900/25 bg-black/20 px-4 py-8 text-center",
                                                        children: drivesEmpty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                explorerError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mb-2 max-w-md text-xs text-rose-400",
                                                                    children: explorerError
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 829,
                                                                    columnNumber: 35
                                                                }, this) : null,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "max-w-[18rem] text-xs leading-relaxed text-cyan-700/90",
                                                                    children: agentReady ? 'No drives from agent — click Retry or check the agent console.' : 'Start agent on this PC: py src\\main.py --api http://3.26.196.232:4000'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 831,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>void reloadAgentData(),
                                                                    className: "cyber-btn mt-4 text-xs",
                                                                    children: "Retry drives"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 836,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "max-w-[15rem] text-xs leading-relaxed text-cyan-700/90",
                                                            children: "Select a drive on the left to browse folders and files."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 841,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 825,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex min-h-0 min-w-0 flex-1 flex-col gap-2",
                                                        children: [
                                                            dirLoading && !explorerError && entries.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "shrink-0 text-[11px] text-cyan-600/90",
                                                                children: "Loading directory…"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 849,
                                                                columnNumber: 31
                                                            }, this) : null,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                                        lineNumber: 852,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                                        lineNumber: 869,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            void refreshDrives();
                                                                            void refreshDir(path);
                                                                        },
                                                                        className: "cyber-btn",
                                                                        children: "Refresh"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                        lineNumber: 881,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                                        lineNumber: 891,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 851,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                                                className: "flex min-h-[2rem] flex-wrap items-center gap-1 rounded-lg border border-cyan-900/25 bg-black/15 px-2 py-1.5 text-xs text-cyan-800/90",
                                                                children: breadcrumb.map((b, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            i > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-cyan-900",
                                                                                children: "\\"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                lineNumber: 909,
                                                                                columnNumber: 44
                                                                            }, this) : null,
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                className: "rounded px-0.5 text-cyan-200/85 transition-colors duration-150 hover:text-cyan-50 hover:underline",
                                                                                onClick: ()=>void refreshDir(b.full),
                                                                                children: b.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                lineNumber: 910,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, b.full, true, {
                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                        lineNumber: 908,
                                                                        columnNumber: 33
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 906,
                                                                columnNumber: 29
                                                            }, this),
                                                            explorerError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-rose-400",
                                                                children: explorerError
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 921,
                                                                columnNumber: 31
                                                            }, this) : null,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "cyber-scroll min-h-0 flex-1 overflow-auto rounded-lg border border-cyan-900/30 bg-black/10",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                    className: "divide-y divide-cyan-950/50",
                                                                    children: filteredEntries.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "truncate text-cyan-50/95",
                                                                                        children: [
                                                                                            e.isDir ? '[DIR] ' : '',
                                                                                            e.name
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                        lineNumber: 941,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    e.size != null && !e.isDir ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "shrink-0 pl-2 text-[10px] text-cyan-700/90",
                                                                                        children: [
                                                                                            (e.size / 1024).toFixed(0),
                                                                                            " KB"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                        lineNumber: 946,
                                                                                        columnNumber: 41
                                                                                    }, this) : null
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                                lineNumber: 927,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        }, e.name, false, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 926,
                                                                            columnNumber: 35
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 924,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 923,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] leading-relaxed text-cyan-900/80",
                                                                children: [
                                                                    "Double-click a folder to open. Click an ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                        className: "text-cyan-600/90",
                                                                        children: ".exe"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                        lineNumber: 956,
                                                                        columnNumber: 71
                                                                    }, this),
                                                                    " to launch on the agent."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                lineNumber: 955,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 847,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 823,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 750,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 749,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "apps",
                                        className: "flex flex-1 flex-col gap-2 p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setAppsTab('installed'),
                                                        className: `rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition-all duration-200 ${appsTab === 'installed' ? 'cyber-pill-active ring-emerald-500/30' : 'cyber-pill-idle'}`,
                                                        children: "Installed"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 967,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setAppsTab('start'),
                                                        className: `rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition-all duration-200 ${appsTab === 'start' ? 'cyber-pill-active ring-emerald-500/30' : 'cyber-pill-idle'}`,
                                                        children: "Start menu"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 975,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>void refreshApps(),
                                                        className: "cyber-btn ml-auto",
                                                        children: "Reload"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                        lineNumber: 983,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                lineNumber: 966,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-cyan-800/90",
                                                children: "Filter with the header search bar."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                lineNumber: 991,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "cyber-scroll min-h-0 flex-1 overflow-auto rounded-lg border border-cyan-900/35 bg-black/30",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "divide-y divide-cyan-950/50",
                                                    children: (appsTab === 'installed' ? filteredInstalled : filteredStart).map((a, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-center gap-2 px-3 py-2 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "min-w-0 flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "truncate font-medium text-cyan-50/95",
                                                                            children: a.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 997,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "truncate text-[11px] text-cyan-800/90",
                                                                            children: appsTab === 'installed' ? a.location || a.version : a.path
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 998,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 996,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                                    lineNumber: 1002,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, `${a.name}-${idx}`, true, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 995,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 993,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                lineNumber: 992,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 965,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "tools",
                                        className: "flex min-h-0 flex-1 flex-col",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuickToolsPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            socket: socket,
                                            conn: conn
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 1023,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1022,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                                        value: "screen",
                                        className: "flex min-h-0 flex-1 flex-col gap-3 p-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: screenViewerRef,
                                            className: `flex min-h-[min(320px,calc(100dvh-18rem))] flex-1 flex-col gap-3 ${screenFullscreen ? 'box-border h-full bg-black/50 p-2' : ''}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                            lineNumber: 1032,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>void captureScreen(),
                                                            disabled: liveDesktop,
                                                            className: "cyber-btn cyber-btn-ghost disabled:pointer-events-none",
                                                            children: "Snapshot"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1045,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>void toggleScreenFullscreen(),
                                                            className: "cyber-btn cyber-btn-ghost",
                                                            children: screenFullscreen ? 'Exit full screen' : 'Full screen'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1053,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "ml-auto flex items-center gap-2 text-[11px] text-cyan-800/95",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "shrink-0",
                                                                    children: "Display"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 1057,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: screenMonitor,
                                                                    onChange: (e)=>setScreenMonitor(Number(e.target.value) || 1),
                                                                    className: "cyber-input max-w-[11rem] py-1 text-xs",
                                                                    children: monitorOptions.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: m.index,
                                                                            children: [
                                                                                m.label,
                                                                                m.width > 0 ? ` (${m.width}×${m.height})` : ''
                                                                            ]
                                                                        }, m.index, true, {
                                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                            lineNumber: 1064,
                                                                            columnNumber: 31
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                                    lineNumber: 1058,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1056,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1031,
                                                    columnNumber: 23
                                                }, this),
                                                screenHint ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs leading-snug text-cyan-700/90",
                                                    children: screenHint
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1072,
                                                    columnNumber: 37
                                                }, this) : null,
                                                screenSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `relative flex min-h-0 w-full flex-1 overflow-hidden rounded-lg border border-cyan-900/35 bg-black/15 ${screenFullscreen ? 'min-h-0 max-h-[calc(100dvh-9rem)] flex-1 sm:max-h-[calc(100dvh-7rem)]' : 'min-h-[min(360px,calc(100dvh-20rem))] flex-1'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: screenSrc,
                                                            alt: "Desktop snapshot",
                                                            className: "mx-auto block h-full w-full max-h-full cursor-crosshair object-contain",
                                                            onClick: onScreenClick
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1080,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-3 pb-2 pt-10 text-left text-[10px] leading-snug text-cyan-200/80",
                                                            children: "Same-screen tunnel effect is normal — switch display or use another device."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                            lineNumber: 1086,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1074,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex flex-1 items-center justify-center rounded-lg border border-dashed border-cyan-900/40 px-4 text-center text-sm text-cyan-800/90 ${screenFullscreen ? 'min-h-[40vh]' : 'min-h-[min(200px,calc(100dvh-22rem))]'}`,
                                                    children: liveDesktop ? 'Waiting for frames… check agent (mss/Pillow) and API.' : 'Start live or take a snapshot — click image to focus a window.'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1091,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 1027,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1026,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 720,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                            lineNumber: 719,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 718,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 713,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-h-0 min-w-0 flex-1 flex-col gap-2 px-2 pb-3 pt-2 md:px-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "cyber-panel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex shrink-0 items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setTerminalFocus(false),
                                        className: "cyber-btn cyber-btn-ghost flex items-center gap-1 px-3 py-1.5 text-xs font-semibold md:text-sm",
                                        children: "← Back to Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1110,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-cyan-600/75",
                                        children: "Terminal workspace"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1117,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1109,
                                columnNumber: 15
                            }, this),
                            accountLine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-1 shrink-0 bg-gradient-to-r from-cyan-200 to-emerald-200 bg-clip-text text-[12px] font-semibold text-transparent",
                                children: accountLine
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1120,
                                columnNumber: 17
                            }, this) : null,
                            machineLine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-2 shrink-0 text-[10px] leading-snug text-cyan-600/90",
                                children: machineLine
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1125,
                                columnNumber: 17
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex shrink-0 gap-1 rounded-xl border border-cyan-500/25 bg-black/50 p-1 ring-1 ring-emerald-500/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShellTab('cmd'),
                                        className: `flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all md:text-sm ${shellTab === 'cmd' ? 'border border-cyan-400/40 bg-cyan-500/20 text-cyan-50 shadow-[0_0_20px_rgba(0,240,255,0.15)]' : 'text-cyan-200/50 hover:text-cyan-100'}`,
                                        children: "CMD"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1128,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShellTab('powershell'),
                                        className: `flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all md:text-sm ${shellTab === 'powershell' ? 'border border-emerald-400/40 bg-emerald-500/15 text-emerald-50 shadow-[0_0_20px_rgba(57,255,20,0.12)]' : 'text-emerald-200/50 hover:text-emerald-100'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex flex-wrap items-center justify-center gap-2",
                                            children: [
                                                "PowerShell",
                                                agentElevated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded border border-rose-500/50 bg-rose-950/80 px-1.5 text-[9px] font-semibold text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.35)]",
                                                    children: "[ADMIN]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                                    lineNumber: 1149,
                                                    columnNumber: 23
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                            lineNumber: 1146,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                        lineNumber: 1138,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1127,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex min-h-0 flex-1 flex-col",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TerminalPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                }, shellTab, false, {
                                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                    lineNumber: 1157,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                                lineNumber: 1156,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ConsoleDashboard.tsx",
                        lineNumber: 1108,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ConsoleDashboard.tsx",
                    lineNumber: 1107,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ConsoleDashboard.tsx",
                lineNumber: 711,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ConsoleDashboard.tsx",
        lineNumber: 627,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/dashboard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.mjs [app-ssr] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/network.mjs [app-ssr] (ecmascript) <export default as Network>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.mjs [app-ssr] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.mjs [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-ssr] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BinaryRain$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BinaryRain.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConsoleDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ConsoleDashboard.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function Dashboard() {
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showConsole, setShowConsole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const quickTools = [
        {
            id: 'terminal',
            label: 'Terminal',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"],
            desc: 'Interactive shell access',
            color: 'cyan'
        },
        {
            id: 'shield',
            label: 'Security',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
            desc: 'System security audit',
            color: 'emerald'
        },
        {
            id: 'zap',
            label: 'Performance',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
            desc: 'Real-time metrics',
            color: 'amber'
        },
        {
            id: 'network',
            label: 'Network',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"],
            desc: 'Network diagnostics',
            color: 'blue'
        },
        {
            id: 'database',
            label: 'Storage',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"],
            desc: 'Disk & storage info',
            color: 'purple'
        },
        {
            id: 'settings',
            label: 'System',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
            desc: 'System configuration',
            color: 'rose'
        }
    ];
    const filteredTools = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!searchQuery.trim()) return quickTools;
        return quickTools.filter((tool)=>tool.label.toLowerCase().includes(searchQuery.toLowerCase()) || tool.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [
        searchQuery
    ]);
    if (showConsole) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ConsoleDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/components/dashboard.tsx",
            lineNumber: 79,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen w-full bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BinaryRain$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-0 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse z-0"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-0 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse z-0"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 pointer-events-none z-[1] matrix-scanlines opacity-[0.06]"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-[2] flex flex-col min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "border-b border-cyan-500/20 backdrop-blur-xl bg-black/40 sticky top-0 z-40 shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between gap-4 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                className: "w-5 h-5 text-cyan-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 105,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/dashboard.tsx",
                                                            lineNumber: 104,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                            className: "text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent tracking-tight",
                                                            children: "NEXUS INTELLIGENCE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/dashboard.tsx",
                                                            lineNumber: 107,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm md:text-base text-cyan-200/70 ml-11 font-light tracking-wide",
                                                    children: "Unified AI control system for real-time automation, analysis, and command execution."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 111,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 102,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 px-3 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                    className: "w-4 h-4 text-emerald-400 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-semibold text-emerald-300",
                                                    children: "ONLINE"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 115,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "absolute left-3 top-3 w-4 h-4 text-cyan-500/60"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Search tools & capabilities... (terminal, security, network, storage)",
                                            value: searchQuery,
                                            onChange: (e)=>setSearchQuery(e.target.value),
                                            className: "w-full pl-10 pr-4 py-2.5 bg-black/40 border border-cyan-500/30 rounded-lg text-cyan-50 placeholder:text-cyan-700/60 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 124,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/dashboard.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "group p-4 rounded-xl border border-cyan-500/20 bg-black/40 hover:bg-cyan-500/5 transition-all duration-300 cursor-default",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold uppercase tracking-wider text-cyan-400/80",
                                                        children: "System Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 140,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-cyan-200 mb-1",
                                                children: "OPERATIONAL"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 146,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-cyan-700/80",
                                                children: "All systems nominal"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 147,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "group p-4 rounded-xl border border-emerald-500/20 bg-black/40 hover:bg-emerald-500/5 transition-all duration-300 cursor-default",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold uppercase tracking-wider text-emerald-400/80",
                                                        children: "Active Sessions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                        className: "w-4 h-4 text-emerald-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 151,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-emerald-200 mb-1",
                                                children: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 157,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-emerald-700/80",
                                                children: "Connected & ready"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 158,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "group p-4 rounded-xl border border-amber-500/20 bg-black/40 hover:bg-amber-500/5 transition-all duration-300 cursor-default",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold uppercase tracking-wider text-amber-400/80",
                                                        children: "Network Uptime"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                        className: "w-4 h-4 text-amber-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 162,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-amber-200 mb-1",
                                                children: "99.8%"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 168,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-amber-700/80",
                                                children: "Secure connection"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 169,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 161,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent tracking-tight mb-2",
                                            children: "Quick Access Tools"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 176,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this),
                                    filteredTools.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowConsole(true),
                                                className: `group/card relative p-5 rounded-xl border bg-black/30 transition-all duration-300 text-left overflow-hidden ${colorClasses[tool.color]}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover/card:from-white/5 group-hover/card:to-white/0 transition-all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start justify-between mb-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `p-2 rounded-lg bg-black/50 ${iconColorClasses[tool.color]}`,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                            className: "w-5 h-5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/dashboard.tsx",
                                                                            lineNumber: 215,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                                        lineNumber: 214,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                        className: "w-4 h-4 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                                        lineNumber: 217,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 213,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-base font-bold text-white mb-1",
                                                                children: tool.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 219,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-cyan-200/60 mb-3",
                                                                children: tool.desc
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 220,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1 text-xs font-semibold text-cyan-400 opacity-0 group-hover/card:opacity-100 transition-opacity",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                        className: "w-3 h-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                                        lineNumber: 222,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " Access tool"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/dashboard.tsx",
                                                                lineNumber: 221,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/dashboard.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, tool.id, true, {
                                                fileName: "[project]/src/components/dashboard.tsx",
                                                lineNumber: 206,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-8 rounded-xl border border-cyan-500/20 bg-black/30 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-cyan-700/80 text-sm",
                                            children: [
                                                'No tools match "',
                                                searchQuery,
                                                '". Try another search or clear to see all.'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 231,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard.tsx",
                                        lineNumber: 230,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowConsole(true),
                                    className: "w-full group relative px-6 py-4 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-white/5 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-white/10 group-hover:to-emerald-500/10 transition-all"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 244,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex items-center justify-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                                    className: "w-5 h-5 text-emerald-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-base font-bold text-emerald-200",
                                                    children: "Launch Full Console Workspace"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 247,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    className: "w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/dashboard.tsx",
                                                    lineNumber: 250,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 245,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard.tsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-8 border-t border-cyan-500/10 text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-cyan-700/70 tracking-wide",
                                    children: [
                                        "NEXUS INTELLIGENCE v1.0 • Advanced system control interface • ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-emerald-400",
                                            children: "Secured"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/dashboard.tsx",
                                            lineNumber: 258,
                                            columnNumber: 77
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/dashboard.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/dashboard.tsx",
                                lineNumber: 256,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function HomePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11yy-ti._.js.map