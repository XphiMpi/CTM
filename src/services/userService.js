import { db } from "@/firebase/firebase";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "users";

export const getUserById = async (uid) => {
  const snap = await getDoc(doc(db, COLLECTION, uid));

  return snap.exists() ? snap.data() : null;
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, COLLECTION));

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const createUser = async (id, payload) => {
  await setDoc(doc(db, COLLECTION, id), {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const updateUser = async (id, payload) => {
  await updateDoc(doc(db, COLLECTION, id), payload);
};

export const removeUser = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
