import { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../entities/notification";
import { useUser } from "../shared/Hooks";
import { useNavigate } from "react-router-dom";
import styles from "./Notifications.module.css";

export default function Notifications() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (!user) return;
    const data = await getNotifications(user.uid);
    setNotifications(data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const handleRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeIcon = (type) => {
    if (type === "grade") return "📊";
    if (type === "schedule") return "📅";
    return "🔔";
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>⬅️ Назад</button>
        <h1 className={styles.title}>🔔 Уведомления</h1>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount} новых</span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className={styles.empty}>📭 Уведомлений нет</div>
      ) : (
        <div className={styles.list}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`${styles.card} ${n.read ? styles.cardRead : styles.cardUnread}`}
            >
              <div className={styles.cardLeft}>
                <span className={styles.cardIcon}>{typeIcon(n.type)}</span>
                <p className={styles.cardText}>{n.text}</p>
                <span className={styles.cardTime}>
                  {n.createdAt?.toDate?.().toLocaleString("ru-RU") || ""}
                </span>
              </div>
              {!n.read && (
                <button className={styles.readBtn} onClick={() => handleRead(n.id)}>
                  ✅ Прочитано
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}