import { db } from "@/firebase/firebase";

import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "reschedules";

export const getReschedules = async () => {
  const snap = await getDocs(collection(db, COLLECTION));

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const createReschedule = async (payload) => {
  await addDoc(collection(db, COLLECTION), {
    ...payload,
    status: "Menunggu",
    createdAt: serverTimestamp(),
  });
};

export const approveReschedule = async (id, jadwalPengganti) => {
  await updateDoc(doc(db, COLLECTION, id), {
    status: "Disetujui",
    jadwalPengganti,
  });
};

export const rejectReschedule = async (id) => {
  await updateDoc(doc(db, COLLECTION, id), {
    status: "Ditolak",
  });
};
