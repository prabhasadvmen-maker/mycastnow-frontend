import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || '';
// API looks like "http://localhost:5000/api" -> socket lives on the server origin
const SOCKET_URL = API.replace(/\/api\/?$/, '');

/**
 * Real-time chat connection.
 * handlers: { 'message:new': fn, 'messages:read': fn, typing: fn, presence: fn, ... }
 * Handlers are read from a ref, so they can close over fresh state without reconnecting.
 */
export default function useChatSocket(token, handlers = {}) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!token) return undefined;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      handlersRef.current.connect?.();
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    ['message:new', 'messages:read', 'conversation:read', 'typing', 'presence'].forEach((evt) => {
      socket.on(evt, (payload) => handlersRef.current[evt]?.(payload));
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token]);

  return { socketRef, connected };
}
