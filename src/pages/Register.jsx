import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
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
  });

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
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = result.user.uid;

      await setDoc(doc(db, "users", uid), {
        name: data.name,
        email: data.email,
        role: data.role,
        classId: data.role === "student" ? data.classId : "",
        subject: data.role === "teacher" ? data.subject : "",
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

          <select className={styles.select} value={data.role} onChange={(e) => setData({ ...data, role: e.target.value, classId: "", subject: "", adminCode: "" })}>
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

          <button className={styles.button} onClick={handleRegister}>Зарегистрироваться</button>
          <p className={styles.link}>
            Уже есть аккаунт?{" "}
            <span className={styles.linkSpan} onClick={() => navigate("/")}>Войти</span>
          </p>
        </div>
      </div>
    </div>
  );
} 