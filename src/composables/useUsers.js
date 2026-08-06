import { ref, computed } from "vue";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

import { db } from "@/firebase/firebase";

const users = ref([]);

export function useUsers() {
  const subscribeUsers = () => {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      users.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
  };

  const removeUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
  };

  const totalUsers = computed(() => users.value.length);

  return {
    users,
    totalUsers,
    subscribeUsers,
    removeUser,
  };
}
