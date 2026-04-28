import { db } from "../firebase/firestore";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

export const addNotification = async (userId, type, text) => {
  await addDoc(collection(db, "notifications"), {
    userId,
    type,
    text,
    read: false,
    createdAt: new Date(),
  });
};

export const getNotifications = async (userId) => {
  const q = query(collection(db, "notifications"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const markAsRead = async (id) => {
  await updateDoc(doc(db, "notifications", id), { read: true });
};