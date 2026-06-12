import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "../axiosInterceptor";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 30_000;

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  const fetchNotifications = useCallback(async () => {
    if (!user?.userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        axios.get("/api/notifications"),
        axios.get("/api/notifications/unread-count"),
      ]);
      if (!mountedRef.current) return;
      setNotifications(Array.isArray(listRes.data) ? listRes.data : []);
      setUnreadCount(
        typeof countRes.data === "number" ? countRes.data : (countRes.data?.count ?? 0)
      );
    } catch {
      if (mountedRef.current) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchNotifications();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user?.userId) return undefined;

    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    const onFocus = () => fetchNotifications();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [user?.userId, fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    await axios.patch(`/api/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await axios.patch("/api/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      refresh: fetchNotifications,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};
