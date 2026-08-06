<script setup>
defineProps({
  attendance: Array,
  children: Array,
});
</script>

<template>
  <div class="space-y-6">
    <!-- Anak -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div
        class="bg-linear-to-r from-[#0C37D3] to-[#108EDC] text-white p-5"
      >
        <h2 class="text-xl font-bold">
          Data Anak
        </h2>

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
            <span
              class="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm"
            >
              {{ child.kelas }}
            </span>
          </div>
        </div>

        <div
          v-if="!children?.length"
          class="text-center py-10 text-gray-400"
        >
          Tidak ada data siswa
        </div>
      </div>
    </div>

    <!-- Statistik Kehadiran -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">
          Total Kehadiran
        </p>

        <h2 class="text-3xl font-bold text-blue-600 mt-2">
          {{ attendance?.length || 0 }}
        </h2>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">
          Hadir
        </p>

        <h2 class="text-3xl font-bold text-green-600 mt-2">
          {{
            attendance?.filter(
              item => item.status === 'Hadir'
            ).length || 0
          }}
        </h2>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">
          Tidak Hadir
        </p>

        <h2 class="text-3xl font-bold text-red-500 mt-2">
          {{
            attendance?.filter(
              item => item.status !== 'Hadir'
            ).length || 0
          }}
        </h2>
      </div>
    </div>

    <!-- Riwayat Kehadiran -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800">
          Riwayat Kehadiran
        </h2>

        <p class="text-sm text-gray-500">
          Monitoring aktivitas belajar siswa
        </p>
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

            <p class="text-sm text-gray-500">
              {{ item.keterangan || 'Tidak ada catatan' }}
            </p>
          </div>

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

        <div
          v-if="!attendance?.length"
          class="text-center py-10 text-gray-400"
        >
          Belum ada data kehadiran
        </div>
      </div>
    </div>
  </div>
</template>