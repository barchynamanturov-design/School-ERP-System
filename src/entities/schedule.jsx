import { db } from "../firebase/firestore";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const scheduleRef = collection(db, "schedule");

export const addLesson = async (data) => {
  await addDoc(scheduleRef, data);
};

export const getLessons = async () => {
  const snap = await getDocs(scheduleRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteLesson = async (id) => {
  await deleteDoc(doc(db, "schedule", id));
};