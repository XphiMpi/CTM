<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

const route = useRoute();
const router = useRouter();
const role = route.params.role;

const email = ref("");
const pass = ref("");

const login = async () => {
  try {
    const userCred = await signInWithEmailAndPassword(
      auth,
      email.value,
      pass.value
    );

    if (!userCred.user.emailVerified) {
      alert("Email belum diverifikasi. Cek inbox email kamu.");
      return;
    }

    alert("Login berhasil");
    router.push("/dashboard");
  } catch (e) {
    alert("Email / Password salah");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0C37D3]">
    <div class="bg-white w-105 p-10 rounded-2xl shadow-2xl">
      <h1 class="text-2xl font-bold text-center mb-6 capitalize">
        Login {{ role }}
      </h1>

      <input v-model="email" type="email" placeholder="Email"
        class="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" />

      <input v-model="pass" type="password" placeholder="Password"
        class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />

      <button @click="login"
        class="w-full mt-5 py-3 bg-[#108EDC] text-white rounded-lg hover:opacity-90">
        Login
      </button>

      <p class="text-center mt-4 text-sm">
        Belum punya akun?
        <span
          @click="router.push('/register/' + role)"
          class="text-blue-600 cursor-pointer hover:underline">
          Register
        </span>
      </p>
    </div>
  </div>
</template>