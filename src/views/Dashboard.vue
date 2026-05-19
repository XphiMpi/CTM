<template>
  <div class="flex h-screen bg-white">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#108EDC] text-white flex flex-col">
      <!-- Profile -->
      <div class="p-6 flex items-center gap-4 border-b border-white/30">
        <div
          class="w-14 h-14 rounded-full border-4 border-[#DCA122] bg-white"
        ></div>

        <div>
          <p class="font-semibold">{{ nama }}</p>
          <p class="text-sm opacity-80">{{ ctmId }}</p>
        </div>
      </div>

      <!-- Menu -->
      <nav class="flex-1 p-4 space-y-3">
        <div
          v-for="item in menus"
          :key="item"
          class="group cursor-pointer"
        >
          <div
            class="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition relative overflow-hidden"
          >
            <span class="relative z-10">{{ item }}</span>

            <!-- Gold Accent -->
            <span
              class="absolute left-0 top-0 h-full w-1 bg-[#DCA122] opacity-0 group-hover:opacity-100 transition"
            ></span>
          </div>
        </div>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-white/30 text-sm opacity-70">
        Emier Teacher Management
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 bg-[#FFEBB7]/30 p-10 overflow-auto">
      <!-- Topbar -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-[#0C37D3]">
          Dashboard
        </h1>

        <button
          @click="logout"
          class="px-4 py-2 bg-[#0C37D3] text-white rounded-lg hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      <!-- Cards -->
      <div
        v-motion
        initial="{ opacity: 0, y: 40 }"
        enter="{ opacity: 1, y: 0 }"
        class="grid grid-cols-3 gap-6"
      >
        <div
          v-for="card in cards"
          :key="card.title"
          class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#DCA122]"
        >
          <h2 class="text-xl font-semibold text-[#0C37D3] mb-2">
            {{ card.title }}
          </h2>

          <p class="text-gray-600">
            {{ card.desc }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const nama = ref("Loading...");
const ctmId = ref("Loading...");

onMounted(async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      router.push("/");
      return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      const data = snap.data();

      nama.value = data.nama;
      ctmId.value = data.ctmId;
    }
  } catch (e) {
    console.log(e);
  }
});

const logout = async () => {
  await signOut(auth);
  router.push("/RoleSelect");
};

const menus = ref([
  "Overview",
  "Attendance",
  "Students",
  "Classes",
  "Reports",
]);

const cards = ref([
  {
    title: "Total Students",
    desc: "Monitor all registered students in your classes.",
  },
  {
    title: "Attendance Today",
    desc: "Track today's teaching attendance status.",
  },
  {
    title: "Active Classes",
    desc: "Manage and monitor active courses easily.",
  },
]);
</script>