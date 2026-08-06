<template>
  <div class="flex h-screen bg-[#f1f2fb] text-gray-900 overflow-hidden">

    <!-- ================= SIDEBAR ================= -->
    <aside class="w-[170px] bg-gradient-to-b from-[#123fc4] to-[#06216d] text-white flex flex-col relative overflow-hidden">

      <!-- Logo -->
      <div class="px-5 pt-4 pb-5">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-2">
            <div class="mt-1 text-[#ffd12e]">
              <!-- Book icon -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.8">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/>
                <path d="M4 5.5v16"/>
              </svg>
            </div>

            <div>
              <div class="text-[12px] font-semibold leading-3">
                Course
              </div>
              <div class="text-[12px] font-semibold leading-3">
                Teacher
              </div>
              <div class="text-[12px] font-semibold text-[#ffd12e] leading-3">
                Management
              </div>
            </div>
          </div>

          <button
            class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </div>
      </div>


      <!-- Guru -->
      <div class="px-5 mb-3">
        <div
          class="h-7 rounded-full bg-[#f5b915] text-black flex items-center justify-center text-[11px] font-semibold"
        >
          GURU
        </div>
      </div>


      <!-- Navigation -->
      <nav class="px-3 space-y-2">

        <!-- Dashboard -->
        <div
          class="h-7 px-3 rounded-full bg-[#f5b915] text-black flex items-center gap-2 text-[11px] font-medium cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 11.5 12 4l9 7.5"/>
            <path d="M5 10v9h14v-9"/>
            <path d="M9 19v-5h6v5"/>
          </svg>

          Dashboard
        </div>


        <!-- Absensi -->
        <div
          class="h-7 px-3 rounded-full text-white flex items-center gap-2 text-[11px] cursor-pointer hover:bg-white/10 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="3"/>
            <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>
            <path d="M18 5v4"/>
            <path d="M16 7h4"/>
          </svg>

          <span class="underline">Absensi</span>
        </div>

      </nav>


      <!-- Decorative Circle -->
      <div
        class="absolute -left-16 bottom-24 w-28 h-28 rounded-full border border-blue-400/20"
      ></div>

      <!-- Logout -->
      <div class="mt-auto px-3 pb-4">
        <button
          class="w-full h-7 rounded-full bg-[#3154b8] hover:bg-[#3b62cf] transition flex items-center gap-3 px-3 text-[10px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 17l5-5-5-5"/>
            <path d="M15 12H3"/>
            <path d="M21 19V5a2 2 0 0 0-2-2h-5"/>
          </svg>

          Keluar
        </button>
      </div>

    </aside>


    <!-- ================= MAIN ================= -->
    <main class="flex-1 flex flex-col min-w-0">


      <!-- ================= TOPBAR ================= -->
      <header class="h-[49px] bg-white flex items-center justify-between px-4 border-b border-gray-100">

        <!-- Welcome -->
        <div>
          <div class="text-[10px] text-[#108edc] font-medium">
            Selamat datang kembali,
          </div>

          <div class="text-[11px] font-semibold">
            {{ nama }}
          </div>
        </div>


        <!-- Right -->
        <div class="flex items-center gap-3">

          <!-- Notification -->
          <button
            class="w-6 h-6 rounded-full bg-[#f4d48b] flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
              <path d="M10 21h4"/>
            </svg>
          </button>


          <!-- Profile -->
          <div
            class="h-7 min-w-[110px] px-2 rounded-full bg-gray-100 flex items-center gap-2"
          >
            <div
              class="w-5 h-5 rounded-full bg-[#1744c6] text-white flex items-center justify-center text-[9px]"
            >
              A
            </div>

            <div class="leading-3">
              <div class="text-[8px] font-semibold">
                {{ nama }}
              </div>

              <div class="text-[7px] text-[#1744c6]">
                Role User
              </div>
            </div>
          </div>

        </div>

      </header>


      <!-- ================= CONTENT ================= -->
      <section class="flex-1 overflow-y-auto p-4">


        <!-- TITLE -->
        <div class="flex items-center justify-between mb-5">

          <div>
            <h1 class="text-[20px] font-bold">
              Dashboard Guru
            </h1>

            <p class="text-[10px] text-gray-500 mt-1">
              Kamis, 15 Mei 2026 • Semester Genap 2025/2026
            </p>
          </div>


          <!-- Absensi button -->
          <button
            class="h-8 px-5 rounded-lg bg-gradient-to-r from-[#1944cc] to-[#439be9] text-white text-[10px] font-semibold flex items-center gap-2 hover:opacity-90 transition"
          >

            <svg width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="7" r="3"/>
              <path d="M3 21c0-4 2.5-7 6-7"/>
              <path d="M17 8v6"/>
              <path d="M14 11h6"/>
            </svg>

            Buka Absensi
          </button>

        </div>


        <!-- ================= STATISTICS ================= -->
        <div class="grid grid-cols-4 gap-3 mb-5">


          <!-- Total Kelas -->
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-start justify-between">

              <div>
                <p class="text-[9px] text-gray-500">
                  Total kelas
                </p>

                <p class="text-[18px] font-bold mt-3">
                  4
                </p>
              </div>

              <div
                class="w-8 h-8 rounded-full bg-[#f5d992] flex items-center justify-center text-[#1750c8]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/>
                  <path d="M4 5.5v16"/>
                </svg>
              </div>

            </div>

            <p class="text-[8px] text-[#1689df] mt-3">
              Semester ini
            </p>
          </div>


          <!-- Total Murid -->
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-start justify-between">

              <div>
                <p class="text-[9px] text-gray-500">
                  Total Murid
                </p>

                <p class="text-[18px] font-bold mt-3">
                  47
                </p>
              </div>

              <div
                class="w-8 h-8 rounded-full bg-[#d8e0ff] flex items-center justify-center text-[#1744cc]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="9" cy="8" r="3"/>
                  <circle cx="17" cy="9" r="2"/>
                  <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6"/>
                  <path d="M15 15c3 0 5 2 5 5"/>
                </svg>
              </div>

            </div>

            <p class="text-[8px] text-[#1689df] mt-3">
              Aktif Terdaftar
            </p>
          </div>


          <!-- Jam Mengajar -->
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-start justify-between">

              <div>
                <p class="text-[9px] text-gray-500">
                  Jam Mengajar
                </p>

                <p class="text-[18px] font-bold mt-3">
                  24
                </p>
              </div>

              <div
                class="w-8 h-8 rounded-full bg-[#f5d992] flex items-center justify-center text-[#1744cc]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="8"/>
                  <path d="M12 7v5l3 2"/>
                </svg>
              </div>

            </div>

            <p class="text-[8px] text-[#1689df] mt-3">
              Per Minggu
            </p>
          </div>


          <!-- Kehadiran -->
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-start justify-between">

              <div>
                <p class="text-[9px] text-gray-500">
                  Avg Kehadiran
                </p>

                <p class="text-[18px] font-bold mt-3">
                  94%
                </p>
              </div>

              <div
                class="w-8 h-8 rounded-full bg-[#d8f0dc] flex items-center justify-center text-green-600"
              >
                <svg width="17" height="17" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19V5"/>
                  <path d="M4 17l5-5 4 3 7-8"/>
                </svg>
              </div>

            </div>

            <p class="text-[8px] text-[#1689df] mt-3">
              Bulan ini
            </p>
          </div>

        </div>


        <!-- ================= ATTENDANCE + TASK ================= -->
        <div class="grid grid-cols-[2fr_1fr] gap-4 mb-5">


          <!-- Attendance -->
          <div class="bg-white rounded-xl overflow-hidden shadow-sm">

            <div class="h-9 px-4 border-b flex items-center justify-between">
              <h2 class="text-[11px] font-semibold">
                Rekap Absensi Terkini
              </h2>

              <button class="text-[8px] text-[#1689df]">
                Lihat semua →
              </button>
            </div>


            <!-- SD 1 -->
            <div class="h-12 px-4 border-b flex items-center justify-between">

              <div>
                <p class="text-[9px] font-medium">
                  SD 1
                </p>

                <p class="text-[7px] text-gray-400">
                  15 MEI 2026
                </p>
              </div>

              <div class="flex gap-3 text-[7px]">
                <span class="text-green-600">
                  ◉ 28 Hadir
                </span>

                <span class="text-yellow-500">
                  ◉ 1 Izin
                </span>

                <span class="text-red-500">
                  ◉ 1 Alfa
                </span>
              </div>

            </div>


            <!-- SMP 3 -->
            <div class="h-12 px-4 border-b flex items-center justify-between">

              <div>
                <p class="text-[9px] font-medium">
                  SMP 3
                </p>

                <p class="text-[7px] text-gray-400">
                  15 MEI 2026
                </p>
              </div>

              <div class="flex gap-3 text-[7px]">
                <span class="text-green-600">
                  ◉ 25 Hadir
                </span>

                <span class="text-yellow-500">
                  ◉ 3 Izin
                </span>

                <span class="text-red-500">
                  ◉ 2 Alfa
                </span>
              </div>

            </div>


            <!-- TK B -->
            <div class="h-12 px-4 flex items-center justify-between">

              <div>
                <p class="text-[9px] font-medium">
                  TK B
                </p>

                <p class="text-[7px] text-gray-400">
                  15 MEI 2026
                </p>
              </div>

              <div class="flex gap-3 text-[7px]">
                <span class="text-green-600">
                  ◉ 30 Hadir
                </span>

                <span class="text-yellow-500">
                  ◉ 0 Izin
                </span>

                <span class="text-red-500">
                  ◉ 0 Alfa
                </span>
              </div>

            </div>

          </div>


          <!-- ================= TASK ================= -->
          <div class="bg-white rounded-xl overflow-hidden shadow-sm">

            <div class="h-9 px-4 border-b flex items-center">
              <h2 class="text-[12px] font-semibold">
                Tugas & Pengingat
              </h2>
            </div>


            <div class="p-4 space-y-3">

              <label class="flex items-center gap-2 text-[9px] text-gray-400 line-through">
                <span class="w-3 h-3 rounded-full border border-gray-300"></span>
                Input nilai kelas SMP 2
              </label>

              <label class="flex items-center gap-2 text-[9px]">
                <span class="w-3 h-3 rounded-full border border-gray-300"></span>
                Rekap absensi bulan Mei
              </label>

              <label class="flex items-center gap-2 text-[9px]">
                <span class="w-3 h-3 rounded-full border border-gray-300"></span>
                Koreksi tugas kelas SMA 1
              </label>

              <label class="flex items-center gap-2 text-[9px] text-gray-400 line-through">
                <span class="w-3 h-3 rounded-full border border-gray-300"></span>
                Input nilai kelas SD 3
              </label>

            </div>

          </div>

        </div>


        <!-- ================= ANNOUNCEMENT ================= -->
        <div class="bg-white rounded-xl overflow-hidden shadow-sm">

          <div class="h-9 px-4 border-b flex items-center">
            <h2 class="text-[12px] font-semibold">
              Pengumuman
            </h2>
          </div>


          <div class="p-4 grid grid-cols-3 gap-3">

            <div class="h-[68px] rounded-xl bg-gray-200"></div>

            <div class="h-[68px] rounded-xl bg-gray-200"></div>

            <div class="h-[68px] rounded-xl bg-gray-200"></div>

          </div>

        </div>

      </section>

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