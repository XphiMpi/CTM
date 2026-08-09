import { ref } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "@/firebase/firebase";
import { getUserById } from "@/services/userService";

const currentUser = ref(null);
const userProfile = ref(null);
const loading = ref(true);

export function useAuth() {
  const initAuth = () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        currentUser.value = null;
        userProfile.value = null;
        loading.value = false;
        return;
      }

      currentUser.value = user;

      const profile = await getUserById(user.uid);

      if (profile?.status === "inactive") {
        alert("Akun telah dinonaktifkan admin");

        await signOut(auth);

        currentUser.value = null;
        userProfile.value = null;
        loading.value = false;

        return;
      }

      userProfile.value = profile;

      loading.value = false;
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return {
    currentUser,
    userProfile,
    loading,
    initAuth,
    logout,
  };
}
