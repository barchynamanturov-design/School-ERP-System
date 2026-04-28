import { db } from "../firebase/firestore";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const gradesRef = collection(db, "grades");

export const addGrade = async (data) => {
  await addDoc(gradesRef, data);
};

export const getGrades = async () => {
  const snap = await getDocs(gradesRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteGrade = async (id) => {
  await deleteDoc(doc(db, "grades", id));
};