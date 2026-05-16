'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

export type ConnState = 'idle' | 'connecting' | 'open' | 'error';

/** Exported for tests / callers that need the same rule as socket URL + transport selection. */
export function isLoopbackHost(host: string): boolean {
  const h = host.toLowerCase();
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1';
}

/**
 * If the user opens the site as http://LAN-IP:3000 but `.env` still says localhost:4000,
 * the browser would otherwise connect to the *viewer's* loopback — never the API.
 * Rewrite loopback in env URLs to the page hostname; leave explicit non-loopback hosts unchanged.
 */
function rewriteLoopbackApiUrlForPage(url: string, pageHostname: string): string {
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
  } catch {
    return trimmed;
  }
}

/** Resolve Socket.IO URL for /console — LAN-friendly when env is unset. */
export function getConsoleSocketUrl(): string {
  const pageHost = typeof window !== 'undefined' ? window.location.hostname : '';

  const direct = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (direct) {
    return rewriteLoopbackApiUrlForPage(direct, pageHost);
  }
  const origin = process.env.NEXT_PUBLIC_API_ORIGIN?.trim().replace(/\/+$/, '');
  if (origin) {
    const o = rewriteLoopbackApiUrlForPage(origin, pageHost);
    return `${o}/console`;
  }
  if (typeof window !== 'undefined') {
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

/** Engine.IO path on the web origin; `next.config` rewrites this to the real Nest `/socket.io`. */
export const CONSOLE_SOCKET_PROXY_ENGINE_PATH = '/console-socket/socket.io';

/**
 * When the UI is on :3000 and the API on :4000 on a **LAN hostname**, the browser treats that as
 * cross-origin; proxying Engine.IO through Next fixes that.
 * On **loopback** (localhost / 127.0.0.1), connect **directly** to :4000 — the proxy can hang in Edge InPrivate.
 */
function getConsoleSocketIoParams(): {
  url: string;
  path: string;
  transports: ('websocket' | 'polling')[];
} {
  const directUrl = getConsoleSocketUrl();
  if (typeof window === 'undefined') {
    return { url: directUrl, path: '/socket.io', transports: ['websocket', 'polling'] };
  }
  const pageOrigin = window.location.origin;
  const pageHost = window.location.hostname;
  const pageIsLoopback = isLoopbackHost(pageHost);
  try {
    const api = new URL(directUrl);
    const page = new URL(pageOrigin);
    const apiPort = api.port || (api.protocol === 'https:' ? '443' : '80');
    const sameHost = api.hostname === page.hostname;
    const sameScheme = api.protocol === page.protocol;
    const useProxy =
      !pageIsLoopback &&
      api.origin !== page.origin &&
      sameHost &&
      sameScheme &&
      apiPort === '4000';
    if (useProxy) {
      return {
        url: `${pageOrigin}/console`,
        path: CONSOLE_SOCKET_PROXY_ENGINE_PATH,
        transports: ['websocket', 'polling'],
      };
    }
  } catch {
    /* fall through to direct */
  }
  return {
    url: directUrl,
    path: '/socket.io',
    transports:
      pageHost && !isLoopbackHost(pageHost)
        ? ['polling', 'websocket']
        : ['websocket', 'polling'],
  };
}

const PORTAL_TIMEOUT_MS = 30_000;

export function useConsoleSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conn, setConn] = useState<ConnState>('idle');
  const [agentReady, setAgentReady] = useState(false);
  const pendingRef = useRef(
    new Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }>(),
  );

  useEffect(() => {
    const { url, path, transports } = getConsoleSocketIoParams();
    const s = io(url, {
      path,
      transports,
      timeout: 45_000,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10_000,
    });

    const onPortal = (msg: {
      requestId?: string;
      ok?: boolean;
      data?: unknown;
      error?: string;
    }) => {
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

    const onLog = (msg: { line?: string }) => {
      const line = msg?.line ?? '';
      if (line.includes('Agent registered')) {
        setAgentReady(true);
      }
      if (line.includes('Agent disconnected')) {
        setAgentReady(false);
      }
    };

    s.on('connect', () => {
      socketRef.current = s;
      setSocket(s);
      setConn('open');
    });
    s.on('disconnect', () => {
      setConn('idle');
      setAgentReady(false);
    });
    const onAgentReady = () => setAgentReady(true);
    s.on('log:line', onLog);
    s.on('agent:ready', onAgentReady);
    s.on('connect_error', () => {
      setConn('error');
    });
    s.on('portal:result', onPortal);

    setConn('connecting');

    return () => {
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

  const portalRequest = useCallback((type: string, payload?: Record<string, unknown>) => {
    const s = socketRef.current;
    if (!s?.connected) {
      return Promise.reject(new Error('Socket not connected'));
    }
    const requestId = crypto.randomUUID();
    return new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!pendingRef.current.has(requestId)) return;
        pendingRef.current.delete(requestId);
        reject(
          new Error(
            'Portal request timed out. Start the Windows agent (`py src\\main.py --api http://YOUR_IP:4000`) and click Retry.',
          ),
        );
      }, PORTAL_TIMEOUT_MS);
      pendingRef.current.set(requestId, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      s.emit('portal:request', { requestId, type, payload });
    });
  }, []);

  return { socket, conn, agentReady, portalRequest };
}
