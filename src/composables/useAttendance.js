import { ref, computed } from "vue";

import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

const attendance = ref([]);

export function useAttendance() {
  const subscribeAttendance = () => {
    return onSnapshot(collection(db, "attendance"), (snapshot) => {
    attendance.value = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    });
  };

  const saveAttendance = async (item) => {
    await updateDoc(doc(db, "attendance", item.id), item);
  };

  const deleteAttendance = async (id) => {
    await deleteDoc(doc(db, "attendance", id));
  };

  const totalAttendance = computed(() => attendance.value.length);

  return {
    attendance,
    totalAttendance,

    subscribeAttendance,

    saveAttendance,
    deleteAttendance,
  };
}
