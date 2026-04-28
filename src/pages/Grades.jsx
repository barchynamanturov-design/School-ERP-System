import { useEffect, useState } from "react";
import { addGrade, getGrades, deleteGrade } from "../entities/class";
import { getStudents } from "../entities/student";
import { useUser } from "../shared/Hooks";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../entities/notification";
import styles from "./Grades.module.css";

export default function Grades() {
  const { userData, user } = useUser();
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [form, setForm] = useState({
    studentId: "",
    subject: "",
    value: "",
    date: "",
  });

  const fetchAll = async () => {
    const g = await getGrades();
    const s = await getStudents();

    if (userData?.role === "student") {
      const myStudent = s.find((st) => st.userId === user.uid);
      setGrades(myStudent ? g.filter((gr) => gr.studentId === myStudent.id) : []);
    } else {
      setGrades(g);
    }
    setStudents(s);
  };

  useEffect(() => {
    if (userData) {
      fetchAll();
      if (userData.role === "teacher") {
        setForm((prev) => ({ ...prev, subject: userData.subject }));
      }
    }
  }, [userData]);

  const handleAdd = async () => {
    if (!form.studentId || !form.subject || !form.value) {
      return alert("Заполните все поля");
    }
    if (form.value < 1 || form.value > 5) {
      return alert("Оценка должна быть от 1 до 5");
    }
    await addGrade({ ...form, createdAt: new Date() });

    const student = students.find((s) => s.id === form.studentId);
    if (student?.userId) {
      await addNotification(
        student.userId,
        "grade",
        `Новая оценка по предмету ${form.subject}: ${form.value}`
      );
    }

    setForm((prev) => ({ ...prev, studentId: "", value: "", date: "" }));
    fetchAll();
  };

  const getStudentName = (id) => {
    const s = students.find((s) => s.id === id);
    return s ? s.name : id;
  };

  const gradeClass = (v) => {
    if (v == 5) return styles.grade5;
    if (v == 4) return styles.grade4;
    if (v == 3) return styles.grade3;
    return styles.grade2;
  };

  const classes = [...new Set(students.map((s) => s.classId))]
    .sort((a, b) => Number(a) - Number(b));

  const filteredStudents = selectedClass
    ? students.filter((s) => s.classId === selectedClass)
    : [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>⬅️ Назад</button>
        <h1 className={styles.title}>📊 Оценки</h1>
      </div>

      {(userData?.role === "admin" || userData?.role === "teacher") && (
        <div className={styles.form}>
          <p className={styles.formTitle}>Добавить оценку</p>

          <select
            className={styles.select}
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setForm({ ...form, studentId: "" });
            }}
          >
            <option value="">Выберите класс</option>
            {classes.map((c) => (
              <option key={c} value={c}>{c} класс</option>
            ))}
          </select>

          {selectedClass && (
            <select
              className={styles.select}
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            >
              <option value="">Выберите ученика</option>
              {filteredStudents.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}

          {userData?.role === "teacher" ? (
            <input className={styles.inputDisabled} value={form.subject} disabled />
          ) : (
            <input
              className={styles.input}
              type="text"
              placeholder="Предмет"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          )}

          <input
            className={styles.input}
            type="number"
            placeholder="Оценка (1-5)"
            min="1"
            max="5"
            value={form.value}
            onChange={(e) => {
              const val = Math.min(5, Math.max(1, Number(e.target.value)));
              setForm({ ...form, value: val });
            }}
          />
          <input
            className={styles.input}
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <button className={styles.addBtn} onClick={handleAdd}>+ Добавить оценку</button>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {userData?.role !== "student" && <th>Класс</th>}
              {userData?.role !== "student" && <th>Ученик</th>}
              <th>Предмет</th>
              <th>Оценка</th>
              <th>Дата</th>
              {userData?.role === "admin" && <th>Удалить</th>}
            </tr>
          </thead>
          <tbody>
            {grades.length === 0 ? (
              <tr><td colSpan="6" className={styles.empty}>Оценок нет</td></tr>
            ) : (
              grades.map((g) => {
                const student = students.find((s) => s.id === g.studentId);
                return (
                  <tr key={g.id}>
                    {userData?.role !== "student" && (
                      <td><span className={styles.classBadge}>{student?.classId} класс</span></td>
                    )}
                    {userData?.role !== "student" && <td>{getStudentName(g.studentId)}</td>}
                    <td>{g.subject}</td>
                    <td>
                      <span className={`${styles.gradeBadge} ${gradeClass(g.value)}`}>
                        {g.value}
                      </span>
                    </td>
                    <td>{g.date}</td>
                    {userData?.role === "admin" && (
                      <td>
                        <button className={styles.deleteBtn} onClick={() => { deleteGrade(g.id); fetchAll(); }}>
                          ❌ Удалить
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}