import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellIcon } from "./icons";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { resolveNotificationLink } from "../utils/notificationLinks";

const formatWhen = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const recent = notifications.slice(0, 8);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async (notification) => {
    if (!notification.read) await markAsRead(notification.id);
    const path = resolveNotificationLink(notification, user?.role);
    setOpen(false);
    if (path) navigate(path);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
        aria-label="Notifications"
      >
        <BellIcon size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-float z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            <Link to="/notifications" onClick={() => setOpen(false)} className="text-xs link-brand">
              View all
            </Link>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No notifications yet</p>
            ) : (
              recent.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleOpen(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 text-sm transition-colors
                    ${n.read ? "bg-white" : "bg-brand-50/40"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900 line-clamp-1">{n.title}</p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                  {n.message && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">{formatWhen(n.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
