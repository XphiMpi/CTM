<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const route = useRoute();
const router = useRouter();

const role = route.params.role;

const email = ref("");
const pass = ref("");
const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

const roleName = computed(() => {
  return role === "teacher"
    ? "Teacher Portal"
    : "Family Portal";
});

const login = async () => {
  if (!email.value || !pass.value) {
    alert("Lengkapi email dan password.");
    return;
  }

  loading.value = true;

  try {
    const userCred = await signInWithEmailAndPassword(
      auth,
      email.value,
      pass.value
    );

    if (!userCred.user.emailVerified) {
      alert("Email belum diverifikasi.");
      return;
    }

    router.push("/dashboard");
  } catch (error) {
    alert("Email atau Password salah");
  } finally {
    loading.value = false;
  }
};

const resetPassword = async () => {
  if (!email.value) {
    alert("Masukkan email terlebih dahulu.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email.value);

    alert(
      "Link reset password telah dikirim ke email Anda."
    );
  } catch (error) {
    alert("Gagal mengirim email reset password.");
  }
};
</script>

<template>
  <section class="flex min-h-screen">
    <!-- LEFT SIDE -->
    <div
      class="relative hidden w-1/2 overflow-hidden lg:flex"
    >
      <!-- Background -->
      <div
        class="absolute inset-0 bg-linear-to-br from-[#0C37D3] via-[#002CB7] to-[#00145C]"
      ></div>

      <!-- Decorative -->
      <div
        class="absolute -left-25 top-20 h-80 w-80 rounded-full bg-white/5"
      ></div>

      <div
        class="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-white/5"
      ></div>

      <div
        class="absolute bottom-12 right-12 h-56 w-56 rounded-full bg-white/5"
      ></div>

      <!-- Content -->
      <div
        class="relative z-10 flex flex-col justify-center px-14 text-white"
      >
        <!-- Logo -->
        <div class="flex items-center gap-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl border border-[#DCA122] text-xl"
          >
            📖
          </div>

          <h1
            class="text-2xl font-semibold text-[#FFEBB7]"
          >
            Course Teacher Management
          </h1>
        </div>

        <!-- Badge -->
        <div
          class="mt-14 inline-flex w-fit rounded-full bg-[#DCA122] px-8 py-3 text-sm text-black"
        >
          platform pendidikan terpadu
        </div>

        <!-- Heading -->
        <h2
          class="mt-8 text-5xl leading-tight xl:text-6xl"
        >
          Belajar Lebih

          <span
            class="block font-bold text-[#DCA122]"
          >
            Cerdas & Menyenangkan
          </span>
        </h2>

        <!-- Desc -->
        <p
          class="mt-6 max-w-xl text-lg text-white/75"
        >
          Solusi manajemen belajar terpadu untuk siswa
          SD hingga SMA. Pantau perkembangan,
          absensi, dan nilai secara real-time.
        </p>
      </div>
    </div>

    <!-- RIGHT SIDE -->
    <div
      class="flex flex-1 items-center justify-center bg-[#F5F6FA] px-6 py-10"
    >
      <div class="w-full max-w-md">
        <!-- Mobile Brand -->
        <div class="mb-8 text-center lg:hidden">
          <h1
            class="text-xl font-bold text-[#2141D0]"
          >
            Course Teacher Management
          </h1>
        </div>

        <!-- Header -->
        <h1
          class="text-3xl font-bold text-gray-900"
        >
          Login Akun
        </h1>

        <p class="mt-2 text-gray-500">
          Masuk ke akun Anda untuk melanjutkan.
        </p>

        <!-- Role -->
        <div
          class="mt-6 rounded-2xl bg-white p-1 shadow-sm"
        >
          <div
            class="rounded-xl bg-linear-to-r from-[#2141D0] to-[#4A86E8] py-3 text-center text-sm font-semibold text-white"
          >
            {{ roleName }}
          </div>
        </div>

        <!-- Form -->
        <div class="mt-8 space-y-5">
          <!-- Email -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="nama@email.com"
              class="w-full rounded-2xl border-0 bg-white px-5 py-4 outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-[#2141D0]"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div class="relative">
              <input
                v-model="pass"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full rounded-2xl border-0 bg-white px-5 py-4 pr-14 outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-[#2141D0]"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {{ showPassword ? "🙈" : "👁" }}
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div
            class="flex items-center justify-between"
          >
            <label
              class="flex items-center gap-2 text-sm text-gray-600"
            >
              <input
                v-model="rememberMe"
                type="checkbox"
                class="accent-[#2141D0]"
              />
              Remember Me
            </label>

            <button
              type="button"
              @click="resetPassword"
              class="text-sm font-medium text-[#2141D0] hover:underline"
            >
              Lupa Password?
            </button>
          </div>

          <!-- Login Button -->
          <button
            @click="login"
            :disabled="loading"
            class="w-full rounded-2xl bg-linear-to-r from-[#2141D0] to-[#4B97E5] py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="loading">
              Logging in...
            </span>

            <span v-else>
              Login
            </span>
          </button>
        </div>

        <!-- Register -->
        <div
          class="mt-6 border-t border-gray-200 pt-5 text-center text-sm"
        >
          <span class="text-gray-600">
            Belum punya akun?
          </span>

          <span
            @click="
              router.push('/register/' + role)
            "
            class="ml-1 cursor-pointer font-semibold text-[#2141D0] hover:underline"
          >
            Register
          </span>
        </div>

        <!-- Back -->
        <div class="mt-4 text-center">
          <button
            @click="router.push('/RoleSelect')"
            class="text-sm text-gray-500 hover:text-[#2141D0]"
          >
            ← Kembali ke pilihan role
          </button>
        </div>
      </div>
    </div>
  </section>
</template>