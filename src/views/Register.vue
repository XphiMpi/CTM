<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth, db } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const route = useRoute();
const router = useRouter();
const type = route.params.role;

const nama = ref("");
const phone = ref("");
const email = ref("");
const pass = ref("");
const vpass = ref("");
const teacherId = ref("");
const studentId = ref("");
const role = ref("teacher");
const loading = ref(false);
let studentData = null;

const isTeacher = computed(() => type === "teacher");

const generateCTMId = async () => {
  const counterRef = doc(db, "counters", "ctm");

  const number = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    let nextNumber = 1;

    if (counterDoc.exists()) {
      nextNumber = counterDoc.data().value + 1;
      transaction.update(counterRef, { value: nextNumber });
    } else {
      transaction.set(counterRef, { value: nextNumber });
    }

    return nextNumber;
  });

  return `CTM-${String(number).padStart(4, "0")}`;
};

const submit = async () => {
  if (
    !nama.value ||
    !phone.value ||
    !email.value ||
    !pass.value ||
    !vpass.value
  ) {
    alert("Semua field wajib diisi");
    return;
  }

  if (pass.value !== vpass.value) {
    alert("Password tidak sama");
    return;
  }

  if (type === "teacher" && !teacherId.value) {
    alert("Teacher ID wajib diisi");
    return;
  }

  if (type === "parent" && !studentId.value) {
    alert("Student ID wajib diisi");
    return;
  }

  let studentData = null;

  if (type === "parent") {
    const q = query(
      collection(db, "students"),
      where("studentId", "==", studentId.value)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("Student ID tidak ditemukan");
      return;
    }

    studentData = snapshot.docs[0].data();
  }

  try {
    loading.value = true;

    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      pass.value
    );

    await sendEmailVerification(userCred.user);

    const finalRole =
      type === "teacher"
        ? role.value
        : type;

    const ctmId = await generateCTMId();

    await setDoc(
      doc(db, "users", userCred.user.uid),
      {
        uid: userCred.user.uid,
        ctmId,

        nama: nama.value,
        phone: phone.value,
        email: email.value,

        role: finalRole,
        type,

        teacherId:
          type === "teacher"
            ? teacherId.value
            : null,

        studentId:
          type === "parent"
            ? studentData.studentId
            : null,

        studentName:
          type === "parent"
            ? studentData.nama
            : null,

        studentClass:
          type === "parent"
            ? studentData.kelas
            : null,

        emailVerified: false,
        createdAt: serverTimestamp(),
      }
    );

    alert(
      `Registrasi berhasil!\nID kamu: ${ctmId}\nCek email untuk verifikasi.`
    );

    router.push(`/login/${type}`);
  } catch (e) {
    alert(e.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-[#0C37D3] via-[#108EDC] to-[#1f5eff] flex items-center justify-center p-6"
  >
    <div
      class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-linear-to-r from-[#0C37D3] to-[#108EDC] text-white p-8">
        <h1 class="text-3xl font-bold capitalize">Register {{ type }}</h1>

        <p class="text-blue-100 mt-2">Course Teacher Management System</p>
      </div>

      <!-- Form -->
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>

            <input
              v-model="nama"
              placeholder="Masukkan nama lengkap"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>

            <input
              v-model="phone"
              placeholder="08xxxxxxxxxx"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="email@email.com"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <!-- Teacher -->
          <div v-if="type === 'teacher'" class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Teacher ID
            </label>

            <input
              v-model="teacherId"
              placeholder="TCH-0001"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <!-- Parent -->
          <div v-if="type === 'parent'" class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Student ID
            </label>

            <input
              v-model="studentId"
              placeholder="STD-0001"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              v-model="pass"
              type="password"
              placeholder="********"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>

            <input
              v-model="vpass"
              type="password"
              placeholder="********"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <!-- Role Teacher -->
          <div v-if="isTeacher" class="md:col-span-2">
            <label class="block mb-2 text-sm font-medium text-gray-700">
              Role
            </label>

            <select
              v-model="role"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </div>

        <!-- Button -->
        <button
          type="button"
          @click="submit"
          :disabled="loading"
          class="w-full mt-8 py-4 bg-linear-to-r from-[#0C37D3] to-[#108EDC] hover:opacity-90 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-60"
        >
          {{ loading ? "Mendaftarkan..." : "Register Sekarang" }}
        </button>

        <!-- Footer -->
        <p class="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?
          <RouterLink
            :to="`/login/${type}`"
            class="text-blue-600 font-semibold hover:underline"
          >
            Login
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
