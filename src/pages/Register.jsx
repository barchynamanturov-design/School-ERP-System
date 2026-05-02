import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../firebase/auth";
import { db } from "../firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

const SUBJECTS = [
  "Математика", "Алгебра", "Геометрия", "Русский язык", "Литература",
  "История", "География", "Биология", "Химия", "Физика",
  "Информатика", "Английский язык", "Физкультура", "Музыка", "ИЗО"
];

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student",
    classId: "",
    subject: "",
    adminCode: "",
    childName: "",
    childClassId: "",
  });
  const [foundChild, setFoundChild] = useState(null);
  const [searchDone, setSearchDone] = useState(false);

const handleSearchChild = async () => {
  if (!data.childName) {
    return alert("Введите имя ребёнка");
  }
  try {
    const snap = await getDocs(collection(db, "students"));
    const students = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    
    const found = students.find((s) =>
      s.name.toLowerCase().includes(data.childName.toLowerCase()) &&
      (data.childClassId ? s.classId === data.childClassId : true)
    );
    
    setFoundChild(found || null);
    setSearchDone(true);
  } catch (error) {
    alert("Ошибка поиска: " + error.message);
  }
};
    const q = query(
      collection(db, "students"),
      where("classId", "==", data.childClassId)
    );
    const snap = await getDocs(q);
    const students = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const found = students.find((s) =>
      s.name.toLowerCase().includes(data.childName.toLowerCase())
    );
    setFoundChild(found || null);
    setSearchDone(true);
  };

  const handleRegister = async () => {
    if (!data.name || !data.email || !data.password) {
      return alert("Заполните все поля");
    }
    if (data.role === "student" && !data.classId) {
      return alert("Выберите класс");
    }
    if (data.role === "teacher" && !data.subject) {
      return alert("Выберите предмет");
    }
    if (data.role === "admin") {
      if (!data.adminCode) return alert("Введите код администратора");
      if (!data.adminCode.endsWith("admin")) return alert("Неверный код администратора!");
    }
    if (data.role === "parent" && !foundChild) {
      return alert("Сначала найдите ребёнка");
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = result.user.uid;

      await setDoc(doc(db, "users", uid), {
        name: data.name,
        email: data.email,
        role: data.role,
        classId: data.role === "student" ? data.classId :
                 data.role === "parent" ? foundChild?.classId : "",
        subject: data.role === "teacher" ? data.subject : "",
        childId: data.role === "parent" ? foundChild?.id : "",
        childName: data.role === "parent" ? foundChild?.name : "",
        relatedIds: [],
        createdAt: new Date(),
      });

      if (data.role === "student") {
        await addDoc(collection(db, "students"), {
          name: data.name,
          userId: uid,
          classId: data.classId,
          parentIds: [],
          createdAt: new Date(),
        });
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🎓 School ERP</h2>
        <p className={styles.subtitle}>Создайте аккаунт</p>
        <div className={styles.form}>
          <input className={styles.input} type="text" placeholder="Имя" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
          <input className={styles.input} type="email" placeholder="Email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
          <input className={styles.input} type="password" placeholder="Пароль" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />

          <select className={styles.select} value={data.role} onChange={(e) => setData({ ...data, role: e.target.value, classId: "", subject: "", adminCode: "", childName: "", childClassId: "" })}>
            <option value="student">Ученик</option>
            <option value="teacher">Учитель</option>
            <option value="parent">Родитель</option>
            <option value="admin">Админ</option>
          </select>

          {data.role === "student" && (
            <select className={styles.select} value={data.classId} onChange={(e) => setData({ ...data, classId: e.target.value })}>
              <option value="">Выберите класс</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={`${num}`}>{num} класс</option>
              ))}
            </select>
          )}

          {data.role === "teacher" && (
            <select className={styles.select} value={data.subject} onChange={(e) => setData({ ...data, subject: e.target.value })}>
              <option value="">Выберите предмет</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          {data.role === "admin" && (
            <input
              className={styles.adminInput}
              type="text"
              placeholder="Код администратора (заканчивается на 'admin')"
              value={data.adminCode}
              onChange={(e) => setData({ ...data, adminCode: e.target.value })}
            />
          )}

          {data.role === "parent" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1e1b4b" }}>🔍 Найдите ребёнка</p>
              <input
                className={styles.input}
                type="text"
                placeholder="Имя ребёнка"
                value={data.childName}
                onChange={(e) => setData({ ...data, childName: e.target.value })}
              />
              <select
                className={styles.select}
                value={data.childClassId}
                onChange={(e) => setData({ ...data, childClassId: e.target.value })}
              >
                <option value="">Выберите класс ребёнка</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={`${num}`}>{num} класс</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSearchChild}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer" }}
              >
                🔍 Найти ребёнка
              </button>

              {searchDone && foundChild && (
                <div style={{ background: "#dcfce7", padding: "10px", borderRadius: "8px", color: "#16a34a", fontWeight: "600" }}>
                  ✅ Найден: {foundChild.name} — {foundChild.classId} класс
                </div>
              )}
              {searchDone && !foundChild && (
                <div style={{ background: "#fee2e2", padding: "10px", borderRadius: "8px", color: "#dc2626" }}>
                  ❌ Ученик не найден. Проверьте имя и класс.
                </div>
              )}
            </div>
          )}

          <button className={styles.button} onClick={handleRegister}>Зарегистрироваться</button>
          <p className={styles.link}>
            Уже есть аккаунт?{" "}
            <span className={styles.linkSpan} onClick={() => navigate("/")}>Войти</span>
          </p>
        </div>
      </div>
    </div>
  );
