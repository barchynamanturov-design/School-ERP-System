import { useEffect, useState } from "react";
import { addLesson, getLessons, deleteLesson } from "../entities/schedule";
import { useUser } from "../shared/Hooks";
import { useNavigate } from "react-router-dom";
import styles from "./Schedule.module.css";

const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];

export default function Schedule() {
  const { userData } = useUser();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    day: "Понедельник",
    subject: "",
    teacher: "",
    startTime: "",
    endTime: "",
    classId: "",
  });

  const fetchLessons = async () => {
    const data = await getLessons();
    setLessons(data);
  };

  useEffect(() => {
    if (userData) fetchLessons();
  }, [userData]);

  const hasConflict = (newLesson) => {
    return lessons.some(
      (l) =>
        l.day === newLesson.day &&
        l.classId === newLesson.classId &&
        l.startTime < newLesson.endTime &&
        newLesson.startTime < l.endTime
    );
  };

  const handleAdd = async () => {
    if (!form.subject || !form.teacher || !form.startTime || !form.endTime || !form.classId) {
      return alert("Заполните все поля");
    }
    if (hasConflict(form)) {
      return alert("Конфликт! В этом классе уже есть урок в это время");
    }
    await addLesson({ ...form, createdAt: new Date() });
    setForm((prev) => ({ ...prev, startTime: "", endTime: "", classId: "", subject: "", teacher: "" }));
    fetchLessons();
  };

  const filteredLessons = lessons.filter((l) => {
    if (userData?.role === "student") return l.classId === userData.classId;
    if (userData?.role === "teacher") return l.subject === userData.subject;
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>⬅️ Назад</button>
        <h1 className={styles.title}>📅 Расписание</h1>
        {userData?.role === "student" && (
          <span className={styles.classBadge}>{userData.classId} класс</span>
        )}
        {userData?.role === "teacher" && (
          <span className={styles.classBadge}>{userData.subject}</span>
        )}
      </div>

      {userData?.role === "admin" && (
        <div className={styles.form}>
          <p className={styles.formTitle}>Добавить урок</p>

          <select className={styles.select} value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            className={styles.select}
            value={form.classId}
            onChange={(e) => setForm({ ...form, classId: e.target.value })}
          >
            <option value="">Выберите класс</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={`${num}`}>{num} класс</option>
            ))}
          </select>

          <input
            className={styles.input}
            type="text"
            placeholder="Предмет"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />

          <input
            className={styles.input}
            type="text"
            placeholder="Учитель"
            value={form.teacher}
            onChange={(e) => setForm({ ...form, teacher: e.target.value })}
          />

          <input
            className={styles.input}
            type="time"
            value={form.startTime}
            onChange={(e) => {
              const start = e.target.value;
              const [h, m] = start.split(":").map(Number);
              const total = h * 60 + m + 45;
              const end = `${Math.floor(total / 60).toString().padStart(2, "0")}:${(total % 60).toString().padStart(2, "0")}`;
              setForm({ ...form, startTime: start, endTime: end });
            }}
          />
          <input className={styles.inputDisabled} type="time" value={form.endTime} disabled />
          <button className={styles.addBtn} onClick={handleAdd}>+ Добавить урок</button>
        </div>
      )}

      {DAYS.map((day) => {
        const dayLessons = filteredLessons
          .filter((l) => l.day === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        if (dayLessons.length === 0) return null;

        return (
          <div key={day} className={styles.dayBlock}>
            <div className={styles.dayTitle}>{day}</div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Класс</th>
                    <th>Предмет</th>
                    <th>Учитель</th>
                    <th>Начало</th>
                    <th>Конец</th>
                    {userData?.role === "admin" && <th>Удалить</th>}
                  </tr>
                </thead>
                <tbody>
                  {dayLessons.map((l) => (
                    <tr key={l.id}>
                      <td><span className={styles.classBadge}>{l.classId} класс</span></td>
                      <td><span className={styles.subjectBadge}>{l.subject}</span></td>
                      <td>{l.teacher}</td>
                      <td><span className={styles.timeBadge}>{l.startTime}</span></td>
                      <td><span className={styles.timeBadge}>{l.endTime}</span></td>
                      {userData?.role === "admin" && (
                        <td>
                          <button className={styles.deleteBtn} onClick={() => { deleteLesson(l.id); fetchLessons(); }}>
                            ❌ Удалить
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}