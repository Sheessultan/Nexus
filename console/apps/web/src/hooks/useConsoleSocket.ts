'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

export type ConnState = 'idle' | 'connecting' | 'open' | 'error';

export function isLoopbackHost(host: string): boolean {
  const h = host.toLowerCase();
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1';
}

function rewriteLoopbackApiUrlForPage(url: string, pageHostname: string): string {
  const trimmed = url.replace(/\/+$/, '');
  if (!pageHostname || isLoopbackHost(pageHostname)) return trimmed;

  try {
    const u = new URL(trimmed);
    if (!isLoopbackHost(u.hostname)) return trimmed;

    u.hostname = pageHostname;
    return u.toString().replace(/\/+$/, '');
  } catch {
    return trimmed;
  }
}

export function getConsoleSocketUrl(): string {
  const pageHost = typeof window !== 'undefined' ? window.location.hostname : '';

  const direct = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (direct) return rewriteLoopbackApiUrlForPage(direct, pageHost);

  const origin = process.env.NEXT_PUBLIC_API_ORIGIN?.trim().replace(/\/+$/, '');
  if (origin) {
    const o = rewriteLoopbackApiUrlForPage(origin, pageHost);
    return `${o}/console`;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;

    if (!isLoopbackHost(hostname) && protocol === 'http:') {
      return `http://${hostname}:4000/console`;
    }

    if (!isLoopbackHost(hostname) && protocol === 'https:') {
      return `https://${hostname}:4000/console`;
    }
  }

  return 'http://localhost:4000/console';
}

export const CONSOLE_SOCKET_PROXY_ENGINE_PATH = '/console-socket/socket.io';

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
    // ignore
  }

  return {
    url: directUrl,
    path: '/socket.io',
    transports: pageHost && !isLoopbackHost(pageHost)
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
      timeout: 45000,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
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

      if (line.includes('Agent registered')) setAgentReady(true);
      if (line.includes('Agent disconnected')) setAgentReady(false);
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

    s.on('log:line', onLog);
    s.on('agent:ready', () => setAgentReady(true));
    s.on('connect_error', () => setConn('error'));
    s.on('portal:result', onPortal);

    setConn('connecting');

    return () => {
      s.off('portal:result', onPortal);
      s.off('log:line', onLog);
      s.disconnect();

      socketRef.current = null;
      pendingRef.current.clear();

      setSocket(null);
      setConn('idle');
      setAgentReady(false);
    };
  }, []);

  const portalRequest = useCallback(
    (type: string, payload?: Record<string, unknown>) => {
      const s = socketRef.current;

      if (!s?.connected) {
        return Promise.reject(new Error('Socket not connected'));
      }

      const requestId = uuidv4();

      return new Promise<unknown>((resolve, reject) => {
        const timer = setTimeout(() => {
          if (!pendingRef.current.has(requestId)) return;

          pendingRef.current.delete(requestId);

          reject(
            new Error(
              'Portal request timed out. Start agent (`py src\\main.py --api http://YOUR_IP:4000`)',
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
    },
    [],
  );

  return { socket, conn, agentReady, portalRequest };
}