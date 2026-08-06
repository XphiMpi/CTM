import { auth } from "@/firebase/firebase";

import { signOut, sendPasswordResetEmail } from "firebase/auth";

export const logoutUser = async () => {
  await signOut(auth);
};

export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
