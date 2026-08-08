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
    } else if (
      status === "izin" ||
      status === "sakit" ||
      status === "permission"
    ) {
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
const newTask = ref("");

const tasks = ref(JSON.parse(localStorage.getItem("teacherTasks") || "[]"));

const saveTasks = () => {
  localStorage.setItem("teacherTasks", JSON.stringify(tasks.value));
};

const addTask = () => {
  if (!newTask.value.trim()) return;

  tasks.value.unshift({
    id: Date.now(),
    text: newTask.value,
    completed: false,
  });

  newTask.value = "";
  saveTasks();
};

const toggleTask = (id) => {
  const task = tasks.value.find((item) => item.id === id);

  if (task) {
    task.completed = !task.completed;
    saveTasks();
  }
};

const deleteTask = (id) => {
  tasks.value = tasks.value.filter((item) => item.id !== id);

  saveTasks();
};

const progressTask = computed(() => {
  if (!tasks.value.length) return 0;

  const completed = tasks.value.filter((task) => task.completed).length;

  return Math.round((completed / tasks.value.length) * 100);
});
</script>

<template>
  <div class="space-y-6 text-slate-800 font-sans">
    <!-- Header Title & Action Button -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
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
      <div
        class="rounded-3xl p-6 bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <span class="text-xs font-semibold text-white/80">Total Kelas</span>
          <span
            class="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center text-sm"
          >
            📖
          </span>
        </div>
        <div class="mt-3">
          <p class="text-3xl font-bold text-white">{{ totalKelasUnik }}</p>
          <p class="text-[11px] text-white/70 font-medium mt-2">Kelas Aktif</p>
        </div>
      </div>

      <!-- Total Murid -->
      <div
        class="rounded-3xl p-6 bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <span class="text-xs font-semibold text-white/80">Total Murid</span>
          <span
            class="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center text-sm"
          >
            🎓
          </span>
        </div>
        <div class="mt-3">
          <p class="text-3xl font-bold text-white">{{ stats.students }}</p>
          <p class="text-[11px] text-white/70 font-medium mt-2">
            Aktif Terdaftar
          </p>
        </div>
      </div>

      <!-- Total Absensi Dicatat -->
      <div
        class="rounded-3xl p-6 bg-linear-to-br from-emerald-500 to-green-600 text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <span class="text-xs font-semibold text-white/80"
            >Catatan Presensi</span
          >
          <span
            class="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center text-sm"
          >
            📝
          </span>
        </div>
        <div class="mt-3">
          <p class="text-3xl font-bold text-white">
            {{ stats.attendance }}
          </p>
          <p class="text-[11px] text-white/70 font-medium mt-2">
            Data Terinput
          </p>
        </div>
      </div>

      <!-- Status Sistem -->
      <div
        class="rounded-3xl p-6 bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <span class="text-xs font-semibold text-white/80"
            >Status Database</span
          >
          <span
            class="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center text-sm"
          >
            ⚡
          </span>
        </div>
        <div class="mt-3">
          <p class="text-xl font-bold text-white">Terhubung</p>
          <p class="text-[11px] text-white/70 font-medium mt-2">
            Realtime Sync
          </p>
        </div>
      </div>
    </div>

    <!-- Rekap Absensi Terkini & Tugas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Rekap Absensi Realtime -->
      <div
        class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60"
      >
        <div
          class="flex items-center justify-between pb-4 border-b border-slate-100"
        >
          <h3 class="text-base font-bold text-slate-900">
            Rekap Absensi Terkini
          </h3>
          <button
            @click="emit('open-absensi')"
            class="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Lihat Semua &gt;
          </button>
        </div>

        <div
          v-if="rekapAbsensiReal.length > 0"
          class="divide-y divide-slate-100"
        >
          <div
            v-for="item in rekapAbsensiReal"
            :key="item.id"
            class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div>
              <p class="text-sm font-bold text-slate-800">{{ item.kelas }}</p>
              <p
                class="text-[11px] text-slate-400 font-medium uppercase mt-0.5"
              >
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

      <!-- Todo List -->
      <div
        class="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/60"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Tugas Guru</h3>

            <p class="text-xs text-slate-500">Kelola aktivitas harian Anda</p>
          </div>

          <span
            class="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold"
          >
            {{ progressTask }}%
          </span>
        </div>

        <!-- Progress -->
        <div class="mb-5">
          <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              :style="{
                width: `${progressTask}%`,
              }"
            ></div>
          </div>
        </div>

        <!-- Input -->
        <div class="flex gap-2 mb-5">
          <input
            v-model="newTask"
            @keyup.enter="addTask"
            type="text"
            placeholder="Tambah tugas baru..."
            class="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />

          <button
            @click="addTask"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl transition"
          >
            +
          </button>
        </div>

        <!-- Task List -->
        <div v-if="tasks.length" class="space-y-2">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
          >
            <div
              class="flex items-center gap-3 cursor-pointer flex-1"
              @click="toggleTask(task.id)"
            >
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition"
                :class="
                  task.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-300'
                "
              >
                <span v-if="task.completed" class="text-xs"> ✓ </span>
              </div>

              <span
                class="text-sm"
                :class="
                  task.completed
                    ? 'line-through text-slate-400'
                    : 'text-slate-700'
                "
              >
                {{ task.text }}
              </span>
            </div>

            <button
              @click="deleteTask(task.id)"
              class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="py-10 text-center">
          <div class="text-5xl mb-3">📝</div>

          <p class="text-slate-500 font-medium">Belum ada tugas</p>

          <p class="text-sm text-slate-400 mt-1">Tambahkan task pertama Anda</p>
        </div>
      </div>
    </div>
  </div>
</template>
