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
  setDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

const route = useRoute();
const router = useRouter();
const type = route.params.role;

const nama = ref("");
const phone = ref("");
const email = ref("");
const pass = ref("");
const vpass = ref("");
const role = ref("teacher");
const loading = ref(false);

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
  if (!nama.value || !phone.value || !email.value || !pass.value || !vpass.value) {
    alert("Semua field wajib diisi");
    return;
  }

  if (pass.value !== vpass.value) {
    alert("Password tidak sama");
    return;
  }

  try {
    loading.value = true;

    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      pass.value
    );

    await sendEmailVerification(userCred.user);

    const finalRole = type === "teacher" ? role.value : type;
    const ctmId = await generateCTMId();

    await setDoc(doc(db, "users", userCred.user.uid), {
      uid: userCred.user.uid,
      ctmId: ctmId,
      nama: nama.value,
      phone: phone.value,
      email: email.value,
      role: finalRole,
      type: type,
      emailVerified: false,
      createdAt: serverTimestamp(),
    });

    alert(`Registrasi berhasil!\nID kamu: ${ctmId}\nCek email untuk verifikasi.`);
    router.push(`/login/${type}`);
  } catch (e) {
    alert(e.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#108EDC]">
    <div class="bg-white w-130 p-10 rounded-2xl shadow-2xl">
      <h1 class="text-3xl font-bold mb-6 capitalize">
        Register {{ type }}
      </h1>

      <div class="space-y-4">
        <input
          v-model="nama"
          placeholder="Nama Lengkap"
          class="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#108EDC]"
        />

        <input
          v-model="phone"
          placeholder="No Telp"
          class="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#108EDC]"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#108EDC]"
        />

        <input
          v-model="pass"
          type="password"
          placeholder="Password"
          class="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#108EDC]"
        />

        <input
          v-model="vpass"
          type="password"
          placeholder="Verifikasi Password"
          class="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#108EDC]"
        />

        <div v-if="isTeacher">
          <select
            v-model="role"
            class="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#108EDC]"
          >
            <option value="admin">Admin</option>
            <option value="monitor">Monitor</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <button
          type="button"
          @click="submit"
          :disabled="loading"
          class="w-full py-3 bg-[#0C37D3] text-white rounded-lg border-b-4 border-[#DCA122] disabled:opacity-60"
        >
          {{ loading ? "Mendaftarkan..." : "Register" }}
        </button>
      </div>
    </div>
  </div>
</template>