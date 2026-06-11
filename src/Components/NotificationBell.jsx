import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { getNotificationHubPath, resolveNotificationLink } from "../utils/notificationLinks";

const formatWhen = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const diffMs = now - d;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const hubPath = getNotificationHubPath(user?.role);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setOpen(false);
    const path = resolveNotificationLink(notification, user?.role);
    if (path) navigate(path);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
      >
        <FaBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[1.1rem] h-[1.1rem] px-1
            flex items-center justify-center rounded-full bg-red-500 text-white
            text-[10px] font-bold leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl
          border border-gray-100 shadow-float z-[60] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium link-brand"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <p className="px-4 py-8 text-sm text-gray-400 text-center">Loading…</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-sm text-gray-400 text-center">No notifications yet</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleOpen(n)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors
                        ${n.read ? "bg-white" : "bg-brand-50/40"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{formatWhen(n.createdAt)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && hubPath && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => { setOpen(false); navigate(hubPath); }}
                className="text-xs font-medium link-brand"
              >
                {user?.role === "user"
                  ? "View applications"
                  : user?.role === "company_admin"
                    ? "Company dashboard"
                    : "Go to dashboard"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
