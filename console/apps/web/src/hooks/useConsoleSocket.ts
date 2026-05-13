'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

export type ConnState = 'idle' | 'connecting' | 'open' | 'error';

export function useConsoleSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conn, setConn] = useState<ConnState>('idle');
  const pendingRef = useRef(
    new Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }>(),
  );

  useEffect(() => {
    const url =
      process.env.NEXT_PUBLIC_SOCKET_URL?.trim() || 'http://localhost:4000/console';
    const s = io(url, {
      transports: ['websocket'],
      timeout: 120_000,
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

    s.on('connect', () => {
      socketRef.current = s;
      setSocket(s);
      setConn('open');
    });
    s.on('disconnect', () => {
      setConn('idle');
    });
    s.on('connect_error', () => {
      setConn('error');
    });
    s.on('portal:result', onPortal);

    setConn('connecting');

    return () => {
      s.off('portal:result', onPortal);
      s.disconnect();
      socketRef.current = null;
      pendingRef.current.clear();
      setSocket(null);
      setConn('idle');
    };
  }, []);

  const portalRequest = useCallback((type: string, payload?: Record<string, unknown>) => {
    const s = socketRef.current;
    if (!s?.connected) {
      return Promise.reject(new Error('Socket not connected'));
    }
    const requestId = crypto.randomUUID();
    return new Promise<unknown>((resolve, reject) => {
      pendingRef.current.set(requestId, { resolve, reject });
      s.emit('portal:request', { requestId, type, payload });
    });
  }, []);

  return { socket, conn, portalRequest };
}
