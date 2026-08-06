import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export const createStudent = async (data) => {
  return await addDoc(collection(db, "students"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const updateStudent = async (id, data) => {
  return await updateDoc(doc(db, "students", id), data);
};

export const removeStudent = async (id) => {
  return await deleteDoc(doc(db, "students", id));
};
