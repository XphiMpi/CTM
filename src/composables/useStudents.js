import { ref, computed } from "vue";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

const students = ref([]);

export function useStudents() {
  const subscribeStudents = () => {
    return onSnapshot(collection(db, "students"), (snapshot) => {
      students.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
  };

  const addStudent = async (student) => {
    await addDoc(collection(db, "students"), {
      ...student,
      createdAt: serverTimestamp(),
    });
  };

  const removeStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
  };

  const totalStudents = computed(() => students.value.length);

  return {
    students,
    totalStudents,
    subscribeStudents,
    addStudent,
    removeStudent,
  };
}
