<script setup>
import { ref } from "vue";

defineProps({
  attendance: Array,
  children: Array,
});

const showPhotoModal = ref(false);
const selectedPhoto = ref("");
const selectedAttendance = ref(null);

const openValidation = (item) => {
  selectedAttendance.value = item;
  selectedPhoto.value = item.photoUrl || "";
  showPhotoModal.value = true;
};

const closeValidation = () => {
  showPhotoModal.value = false;
  selectedPhoto.value = "";
  selectedAttendance.value = null;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Anak -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="bg-linear-to-r from-[#0C37D3] to-[#108EDC] text-white p-5">
        <h2 class="text-xl font-bold">Data Anak</h2>

        <p class="text-blue-100 text-sm">
          Informasi siswa yang terhubung dengan akun orang tua
        </p>
      </div>

      <div class="p-6">
        <div
          v-for="child in children"
          :key="child.id"
          class="border border-gray-100 rounded-xl p-4 mb-3 hover:shadow-md transition"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-lg text-gray-800">
                {{ child.nama }}
              </h3>

              <p class="text-gray-500 text-sm">
                {{ child.studentId }}
              </p>
            </div>

            <span
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="
                child.status === 'Aktif'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ child.status }}
            </span>
          </div>

          <div class="mt-3">
            <span class="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm">
              {{ child.kelas }}
            </span>
          </div>
        </div>

        <div v-if="!children?.length" class="text-center py-10 text-gray-400">
          Tidak ada data siswa
        </div>
      </div>
    </div>

    <!-- Statistik Kehadiran -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">Total Kehadiran</p>

        <h2 class="text-3xl font-bold text-blue-600 mt-2">
          {{ attendance?.length || 0 }}
        </h2>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">Hadir</p>

        <h2 class="text-3xl font-bold text-green-600 mt-2">
          {{
            attendance?.filter((item) => item.status === "Hadir").length || 0
          }}
        </h2>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">Tidak Hadir</p>

        <h2 class="text-3xl font-bold text-red-500 mt-2">
          {{
            attendance?.filter((item) => item.status !== "Hadir").length || 0
          }}
        </h2>
      </div>
    </div>

    <!-- Riwayat Kehadiran -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800">Riwayat Kehadiran</h2>

        <p class="text-sm text-gray-500">Monitoring aktivitas belajar siswa</p>
      </div>

      <div class="divide-y">
        <div
          v-for="item in attendance"
          :key="item.id"
          class="flex items-center justify-between p-5 hover:bg-gray-50 transition"
        >
          <div>
            <p class="font-medium text-gray-800">
              {{ item.tanggal }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="item.photoUrl"
              @click="openValidation(item)"
              class="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              📷 Cek Validasi
            </button>

            <span
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="
                item.status === 'Hadir'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ item.status }}
            </span>
          </div>
        </div>

        <div v-if="!attendance?.length" class="text-center py-10 text-gray-400">
          Belum ada data kehadiran
        </div>
      </div>
    </div>

    <!-- Modal Validasi Foto -->
    <div
      v-if="showPhotoModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl"
      >
        <!-- Header -->
        <div
          class="bg-linear-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 flex items-center justify-between"
        >
          <div>
            <h3 class="text-xl font-bold">Validasi Kehadiran</h3>

            <p class="text-blue-100 text-sm">Bukti foto kehadiran siswa</p>
          </div>

          <button
            @click="closeValidation"
            class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="grid md:grid-cols-2 gap-6 p-6">
          <!-- Foto -->
          <div>
            <img
              v-if="selectedPhoto"
              :src="selectedPhoto"
              alt="Foto Validasi"
              class="w-full h-80 object-cover rounded-2xl border shadow"
            />

            <div
              v-else
              class="h-80 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-400"
            >
              Foto tidak tersedia
            </div>
          </div>

          <!-- Detail -->
          <div v-if="selectedAttendance" class="space-y-4">
            <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p class="text-sm text-gray-500">Tanggal</p>

              <p class="font-semibold text-gray-800">
                {{ selectedAttendance.tanggal }}
              </p>
            </div>

            <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p class="text-sm text-gray-500">Kelas</p>

              <p class="font-semibold text-gray-800">
                {{ selectedAttendance.kelas }}
              </p>
            </div>

            <div class="bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
              <p class="text-sm text-gray-500">Mata Pelajaran</p>

              <p class="font-semibold text-gray-800">
                {{ selectedAttendance.mapel }}
              </p>
            </div>

            <div class="bg-green-50 border border-green-100 rounded-2xl p-4">
              <p class="text-sm text-gray-500">Wajah Terdeteksi</p>

              <p class="text-3xl font-bold text-green-600">
                {{ selectedAttendance.detectedFaces }}
              </p>
            </div>

            <div class="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
              <p class="text-sm text-gray-500">Status Kehadiran</p>

              <span
                class="inline-flex px-3 py-1 rounded-full text-sm font-semibold"
                :class="
                  selectedAttendance.status === 'Hadir'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{ selectedAttendance.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
