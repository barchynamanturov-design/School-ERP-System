import { useUser } from "../shared/Hooks";
import { logoutUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const ROLE_COLORS = {
  admin: "#dc2626",
  teacher: "#2563eb",
  student: "#16a34a",
  parent: "#d97706",
};

const ROLE_NAMES = {
  admin: "Администратор",
  teacher: "Учитель",
  student: "Ученик",
  parent: "Родитель",
};

const CARD_COLORS = {
  students: "#4f46e5",
  grades: "#16a34a",
  schedule: "#2563eb",
  notifications: "#d97706",
  seed: "#dc2626",
};

export default function Dashboard() {
  const { userData, loading } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  if (loading || !userData) return (
    <div className={styles.loading}>Загрузка...</div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>🎓 School ERP</h1>
          <p>Система управления школой</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{userData.name}</p>
            <span
              className={styles.roleBadge}
              style={{ background: ROLE_COLORS[userData.role] }}
            >
              {ROLE_NAMES[userData.role]}
            </span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.welcome}>Добро пожаловать, {userData.name}! 👋</p>

        <div className={styles.grid}>
{(userData.role === "admin" || userData.role === "teacher") && (
  <div className={styles.card} style={{ borderTopColor: CARD_COLORS.students }} onClick={() => navigate("/students")}>
    <div className={styles.cardIcon}>👨‍🎓</div>
    <p className={styles.cardTitle}>Ученики</p>
  </div>
)}
          <div className={styles.card} style={{ borderTopColor: CARD_COLORS.grades }} onClick={() => navigate("/grades")}>
            <div className={styles.cardIcon}>📊</div>
            <p className={styles.cardTitle}>Оценки</p>
          </div>
          <div className={styles.card} style={{ borderTopColor: CARD_COLORS.schedule }} onClick={() => navigate("/schedule")}>
            <div className={styles.cardIcon}>📅</div>
            <p className={styles.cardTitle}>Расписание</p>
          </div>
          <div className={styles.card} style={{ borderTopColor: CARD_COLORS.notifications }} onClick={() => navigate("/notifications")}>
            <div className={styles.cardIcon}>🔔</div>
            <p className={styles.cardTitle}>Уведомления</p>
          </div>
{userData.role === "admin" && (
  <div className={styles.card} style={{ borderTopColor: CARD_COLORS.students }} onClick={() => navigate("/students")}>
    <div className={styles.cardIcon}>👨‍🎓</div>
    <p className={styles.cardTitle}>Ученики</p>
  </div>
)}
        </div>
      </div>
    </div>
  );
}