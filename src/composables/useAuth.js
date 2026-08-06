import { ref } from "vue";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/firebase/firebase";
import { getUserById } from "@/services/userService";

const currentUser = ref(null);
const userProfile = ref(null);
const loading = ref(true);

export function useAuth() {
  const initAuth = () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        loading.value = false;
        return;
      }

      currentUser.value = user;

      userProfile.value = await getUserById(user.uid);

      loading.value = false;
    });
  };

  return {
    currentUser,
    userProfile,
    loading,
    initAuth,
  };
}
