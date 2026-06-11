import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "../axiosInterceptor";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

const POLL_INTERVAL_MS = 10_000;

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  const fetchConversations = useCallback(async () => {
    if (!user?.userId) {
      setConversations([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        axios.get("/api/chat/conversations"),
        axios.get("/api/chat/unread-count"),
      ]);
      if (!mountedRef.current) return;
      setConversations(Array.isArray(listRes.data) ? listRes.data : []);
      setUnreadCount(typeof countRes.data === "number" ? countRes.data : 0);
    } catch {
      /* keep existing list on transient errors */
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchConversations();
    return () => { mountedRef.current = false; };
  }, [fetchConversations]);

  useEffect(() => {
    if (!user?.userId) return undefined;

    const interval = setInterval(fetchConversations, POLL_INTERVAL_MS);
    const onFocus = () => fetchConversations();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [user?.userId, fetchConversations]);

  const openConversation = useCallback(async (payload) => {
    const { data } = await axios.post("/api/chat/conversations", payload);
    await fetchConversations();
    return data;
  }, [fetchConversations]);

  const upsertConversation = useCallback((conv) => {
    if (!conv?.id) return;
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === conv.id);
      if (idx === -1) return [conv, ...prev];
      const next = [...prev];
      next[idx] = { ...next[idx], ...conv };
      return next.sort((a, b) => {
        const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return bTime - aTime;
      });
    });
  }, []);

  const value = useMemo(
    () => ({
      conversations,
      unreadCount,
      loading,
      refresh: fetchConversations,
      openConversation,
      upsertConversation,
    }),
    [conversations, unreadCount, loading, fetchConversations, openConversation, upsertConversation],
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
