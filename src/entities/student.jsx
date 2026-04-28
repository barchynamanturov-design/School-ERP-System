import { db } from "../firebase/firestore";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const studentsRef = collection(db, "students");

export const addStudent = async (data) => {
  await addDoc(studentsRef, data);
};

export const getStudents = async () => {
  const snap = await getDocs(studentsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteStudent = async (id) => {
  await deleteDoc(doc(db, "students", id));
};