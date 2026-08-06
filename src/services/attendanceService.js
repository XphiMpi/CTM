import { db } from "@/firebase/firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "attendance";

export const getAttendance = async () => {
  const snap = await getDocs(collection(db, COLLECTION));

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const createAttendance = async (payload) => {
  await addDoc(collection(db, COLLECTION), {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const updateAttendance = async (id, payload) => {
  await updateDoc(doc(db, COLLECTION, id), payload);
};

export const deleteAttendance = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
