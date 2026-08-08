<script setup>
import { computed } from "vue";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import {
  Doughnut,
  Bar,
} from "vue-chartjs";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },

  users: {
    type: Array,
    default: () => [],
  },

  students: {
    type: Array,
    default: () => [],
  },
});

/* ======================
   STUDENT STATUS
====================== */
const studentStatusChart = computed(() => {
  const aktif = props.students.filter(
    (student) => student.status === "Aktif"
  ).length;

  const nonAktif = props.students.filter(
    (student) => student.status !== "Aktif"
  ).length;

  return {
    labels: ["Aktif", "Non Aktif"],
    datasets: [
      {
        data: [aktif, nonAktif],
        backgroundColor: [
          "#22c55e",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };
});

/* ======================
   USER DISTRIBUTION
====================== */
const userRoleChart = computed(() => {
  const admin = props.users.filter(
    (user) => user.role === "admin"
  ).length;

  const teacher = props.users.filter(
    (user) => user.role === "teacher"
  ).length;

  const parent = props.users.filter(
    (user) => user.role === "parent"
  ).length;

  return {
    labels: ["Admin", "Teacher", "Parent"],
    datasets: [
      {
        label: "Total User",
        data: [admin, teacher, parent],
        backgroundColor: [
          "#ef4444",
          "#3b82f6",
          "#22c55e",
        ],
        borderRadius: 12,
      },
    ],
  };
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },
  },

  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome -->
    <div
      class="bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white rounded-3xl p-8 shadow-xl"
    >
      <h1 class="text-3xl font-bold">
        Selamat Datang Admin 👋
      </h1>

      <p class="mt-2 text-blue-100">
        Kelola seluruh aktivitas sekolah dari dashboard ini.
      </p>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <!-- Student -->
      <div
        class="bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-3xl p-6 shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-100">
              Total Student
            </p>

            <h2 class="text-4xl font-bold mt-2">
              {{ stats.students }}
            </h2>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl"
          >
            🎓
          </div>
        </div>
      </div>

      <!-- User -->
      <div
        class="bg-linear-to-r from-purple-600 to-purple-500 text-white rounded-3xl p-6 shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-100">
              Total User
            </p>

            <h2 class="text-4xl font-bold mt-2">
              {{ stats.users }}
            </h2>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl"
          >
            👥
          </div>
        </div>
      </div>

      <!-- Active Student -->
      <div
        class="bg-linear-to-r from-green-600 to-emerald-500 text-white rounded-3xl p-6 shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-100">
              Student Aktif
            </p>

            <h2 class="text-4xl font-bold mt-2">
              {{ stats.activeStudents }}
            </h2>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl"
          >
            ✅
          </div>
        </div>
      </div>

      <!-- Pending -->
      <div
        class="bg-linear-to-r from-orange-500 to-red-500 text-white rounded-3xl p-6 shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-orange-100">
              Pending Reschedule
            </p>

            <h2 class="text-4xl font-bold mt-2">
              {{ stats.pendingReschedule }}
            </h2>
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl"
          >
            🔄
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Student Status -->
      <div
        class="bg-white rounded-3xl border border-gray-100 p-6 shadow-xl"
      >
        <h3 class="text-xl font-bold text-gray-800">
          Student Status
        </h3>

        <p class="text-sm text-gray-500 mb-6">
          Distribusi siswa aktif dan non aktif
        </p>

        <div class="h-87.5">
          <Doughnut
            :data="studentStatusChart"
            :options="doughnutOptions"
          />
        </div>
      </div>

      <!-- User Distribution -->
      <div
        class="bg-white rounded-3xl border border-gray-100 p-6 shadow-xl"
      >
        <h3 class="text-xl font-bold text-gray-800">
          User Distribution
        </h3>

        <p class="text-sm text-gray-500 mb-6">
          Distribusi role pengguna sistem
        </p>

        <div class="h-87.5">
          <Bar
            :data="userRoleChart"
            :options="barOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>