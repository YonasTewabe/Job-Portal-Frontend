import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { resolveNotificationLink } from "../utils/notificationLinks";
import Spinner from "../Components/Spinner";
import { Page, PageTitle, Card, Empty, Btn } from "../Components/ui";
import { BellIcon } from "../Components/icons";

const formatWhen = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleOpen = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    const path = resolveNotificationLink(notification, user?.role);
    if (path) navigate(path);
  };

  return (
    <Page className="max-w-2xl">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <PageTitle>All notifications</PageTitle>
          <p className="text-sm text-gray-500 mt-1">
            {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllAsRead} className={Btn.secondary("text-sm shrink-0")}>
            Mark all read
          </button>
        )}
      </div>

      <Card className="p-0 overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="py-16"><Spinner loading /></div>
        ) : notifications.length === 0 ? (
          <Empty message="No notifications yet." icon={BellIcon} />
        ) : (
          <ul className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => handleOpen(n)}
                  className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors
                    ${n.read ? "bg-white" : "bg-brand-50/40"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatWhen(n.createdAt)}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Page>
  );
};

export default Notifications;
