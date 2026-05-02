import { useEffect, useState } from "react";
import { addStudent, getStudents, deleteStudent } from "../entities/student";
import { useUser } from "../shared/Hooks";
import { useNavigate } from "react-router-dom";
import styles from "./Students.module.css";

export default function Students() {
  const { userData } = useUser();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [form, setForm] = useState({ name: "", classId: "" });

  const fetchStudents = async () => {
    const data = await getStudents();
    setStudents(data.sort((a, b) => Number(a.classId) - Number(b.classId)));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdd = async () => {
    if (!form.name) return alert("Введите имя");
    if (!form.classId) return alert("Выберите класс");
    await addStudent({ ...form, userId: "", createdAt: new Date() });
    setForm({ name: "", classId: "" });
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await deleteStudent(id);
    fetchStudents();
  };

  // Уникальные классы
  const classes = [...new Set(students.map((s) => s.classId))]
    .sort((a, b) => Number(a) - Number(b));

  // Ученики выбранного класса
  const filteredStudents = selectedClass
    ? students.filter((s) => s.classId === selectedClass)
    : [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>⬅️ Назад</button>
        <h1 className={styles.title}>👨‍🎓 Ученики</h1>
      </div>

      {/* Только админ может добавлять */}
      {userData?.role === "admin" && (
        <div className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="Имя ученика"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            className={styles.input}
            value={form.classId}
            onChange={(e) => setForm({ ...form, classId: e.target.value })}
          >
            <option value="">Выберите класс</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={`${num}`}>{num} класс</option>
            ))}
          </select>
          <button className={styles.addBtn} onClick={handleAdd}>+ Добавить</button>
        </div>
      )}

      {/* Выбор класса */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {classes.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedClass(selectedClass === c ? "" : c)}
            style={{
              padding: "8px 20px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: selectedClass === c ? "#4f46e5" : "white",
              color: selectedClass === c ? "white" : "#4f46e5",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {c} класс
          </button>
        ))}
      </div>

      {/* Список учеников */}
      {selectedClass && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>Имя</th>
                <th>Класс</th>
                {userData?.role === "admin" && <th>Удалить</th>}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#888" }}>Нет учеников</td></tr>
              ) : (
                filteredStudents.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>{s.name}</td>
                    <td><span className={styles.classBadge}>{s.classId} класс</span></td>
                    {userData?.role === "admin" && (
                      <td>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(s.id)}>❌ Удалить</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!selectedClass && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
          👆 Выберите класс чтобы увидеть учеников
        </p>
      )}
    </div>
  );
}