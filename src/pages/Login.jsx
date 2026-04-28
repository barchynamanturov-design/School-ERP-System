import { useState } from "react";
import { loginUser } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      await loginUser(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🎓 School ERP</h2>
        <p className={styles.subtitle}>Войдите в систему</p>
        <div className={styles.form}>
          <input className={styles.input} type="email" placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} />
          <input className={styles.input} type="password" placeholder="Пароль" onChange={(e) => setData({ ...data, password: e.target.value })} />
          <button className={styles.button} onClick={handleLogin}>Войти</button>
          <p className={styles.link}>
            Нет аккаунта?{" "}
            <span className={styles.linkSpan} onClick={() => navigate("/register")}>Зарегистрироваться</span>
          </p>
        </div>
      </div>
    </div>
  );
}