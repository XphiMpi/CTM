<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      students: 0,
      attendance: 0,
    }),
  },
  attendanceList: {
    type: Array,
    default: () => [],
  },
  studentList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["open-absensi", "view-all-absensi"]);

/* ---------------------------------------------------- */
/* REKAP ABSENSI REALTIME DARI DATABASE                 */
/* ---------------------------------------------------- */
const rekapAbsensiReal = computed(() => {
  if (!props.attendanceList || props.attendanceList.length === 0) return [];

  // Grouping data berdasarkan kelas / tanggal
  const grouped = {};

  props.attendanceList.forEach((item) => {
    const kelas = item.kelas || item.kelasName || "Kelas Umum";
    const tanggal = item.tanggal || item.date || "Hari Ini";
    const key = `${kelas}_${tanggal}`;

    if (!grouped[key]) {
      grouped[key] = {
        id: key,
        kelas,
        tanggal,
        hadir: 0,
        izin: 0,
        alfa: 0,
      };
    }

    const status = (item.status || "").toLowerCase();
    if (status === "hadir" || status === "present") {
      grouped[key].hadir++;
    } else if (status === "izin" || status === "sakit" || status === "permission") {
      grouped[key].izin++;
    } else if (status === "alfa" || status === "absent") {
      grouped[key].alfa++;
    }
  });

  // Ambil 3 data paling baru
  return Object.values(grouped).slice(0, 3);
});

/* Total Kelas Unik */
const totalKelasUnik = computed(() => {
  const setKelas = new Set();
  props.studentList.forEach((s) => {
    if (s.kelas) setKelas.add(s.kelas);
  });
  props.attendanceList.forEach((a) => {
    if (a.kelas) setKelas.add(a.kelas);
  });
  return setKelas.size || 1;
});

/* Tasks Checklist State */
const tasks = ref([
  { id: 1, text: "Rekap absensi mingguan", completed: false },
  { id: 2, text: "Koreksi tugas & catatan siswa", completed: false },
  { id: 3, text: "Input kehadiran hari ini", completed: true },
]);

const toggleTask = (id) => {
  const t = tasks.value.find((item) => item.id === id);
  if (t) t.completed = !t.completed;
};
</script>

<template>
  <div class="space-y-6 text-slate-800 font-sans">
    <!-- Header Title & Action Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
          Dashboard Guru
        </h2>
        <p class="text-sm font-medium text-slate-500 mt-1">
          Selamat bertugas — Kelola presensi & aktivitas kelas Anda
        </p>
      </div>

      <button
        @click="emit('open-absensi')"
        class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <span>📋</span>
        <span>Buka Absensi</span>
      </button>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Kelas -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <span class="text-xs font-semibold text-slate-500">Total Kelas</span>
          <span class="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">
            📖
          </span>
        </div>
        <div class="mt-3">
          <p class="text-3xl font-bold text-slate-900">{{ totalKelasUnik }}</p>
          <p class="text-[11px] text-blue-500 font-medium mt-2">Kelas Aktif</p>
        </div>
      </div>

      <!-- Total Murid -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <span class="text-xs font-semibold text-slate-500">Total Murid</span>
          <span class="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
            🎓
          </span>
        </div>
        <div class="mt-3">
          <p class="text-3xl font-bold text-slate-900">{{ stats.students }}</p>
          <p class="text-[11px] text-blue-500 font-medium mt-2">Aktif Terdaftar</p>
        </div>
      </div>

      <!-- Total Absensi Dicatat -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <span class="text-xs font-semibold text-slate-500">Catatan Presensi</span>
          <span class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">
            📝
          </span>
        </div>
        <div class="mt-3">
          <p class="text-3xl font-bold text-slate-900">{{ stats.attendance }}</p>
          <p class="text-[11px] text-blue-500 font-medium mt-2">Data Terinput</p>
        </div>
      </div>

      <!-- Status Sistem -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <span class="text-xs font-semibold text-slate-500">Status Database</span>
          <span class="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
            ⚡
          </span>
        </div>
        <div class="mt-3">
          <p class="text-xl font-bold text-emerald-600">Terhubung</p>
          <p class="text-[11px] text-blue-500 font-medium mt-2">Realtime Sync</p>
        </div>
      </div>
    </div>

    <!-- Rekap Absensi Terkini & Tugas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Rekap Absensi Realtime -->
      <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 class="text-base font-bold text-slate-900">Rekap Absensi Terkini</h3>
          <button
            @click="emit('open-absensi')"
            class="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Lihat Semua &gt;
          </button>
        </div>

        <div v-if="rekapAbsensiReal.length > 0" class="divide-y divide-slate-100">
          <div
            v-for="item in rekapAbsensiReal"
            :key="item.id"
            class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div>
              <p class="text-sm font-bold text-slate-800">{{ item.kelas }}</p>
              <p class="text-[11px] text-slate-400 font-medium uppercase mt-0.5">
                {{ item.tanggal }}
              </p>
            </div>

            <div class="flex items-center gap-4 text-xs font-semibold">
              <span class="text-emerald-600 flex items-center gap-1">
                ✔ {{ item.hadir }} Hadir
              </span>
              <span class="text-amber-500 flex items-center gap-1">
                🕒 {{ item.izin }} Izin
              </span>
              <span class="text-rose-500 flex items-center gap-1">
                🚫 {{ item.alfa }} Alfa
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State jika database absensi belum ada -->
        <div v-else class="py-8 text-center text-slate-400 text-sm">
          Belum ada data absensi di dalam database.
        </div>
      </div>

      <!-- Tugas & Pengingat -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
        <h3 class="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Tugas & Pengingat
        </h3>

        <div class="space-y-3">
          <div
            v-for="task in tasks"
            :key="task.id"
            @click="toggleTask(task.id)"
            class="flex items-center gap-3 cursor-pointer group"
          >
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition"
              :class="
                task.completed
                  ? 'border-slate-300 bg-slate-100'
                  : 'border-slate-300 group-hover:border-blue-500'
              "
            >
              <span v-if="task.completed" class="text-slate-400 text-xs">✓</span>
            </div>
            <span
              class="text-sm font-medium transition"
              :class="
                task.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-700 group-hover:text-slate-900'
              "
            >
              {{ task.text }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>