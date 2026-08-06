<script setup>
defineProps({
  requests: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["add"]);
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="bg-linear-to-r from-[#0C37D3] to-[#108EDC] rounded-2xl p-6 text-white shadow-lg"
    >
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold">
            Reschedule Request
          </h2>

          <p class="text-blue-100 mt-1">
            Ajukan perubahan jadwal belajar anak
          </p>
        </div>

        <button
          @click="$emit('add')"
          class="bg-white text-[#0C37D3] font-semibold px-5 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          + Request Baru
        </button>
      </div>
    </div>

    <!-- Statistik -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">
          Total Request
        </p>

        <h3 class="text-3xl font-bold text-blue-600 mt-2">
          {{ requests.length }}
        </h3>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">
          Menunggu
        </p>

        <h3 class="text-3xl font-bold text-orange-500 mt-2">
          {{
            requests.filter(
              item => item.status === "Menunggu"
            ).length
          }}
        </h3>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">
          Disetujui
        </p>

        <h3 class="text-3xl font-bold text-green-600 mt-2">
          {{
            requests.filter(
              item => item.status === "Disetujui"
            ).length
          }}
        </h3>
      </div>
    </div>

    <!-- List Request -->
    <div
      class="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      <div class="p-5 border-b border-gray-100">
        <h3 class="font-semibold text-lg">
          Riwayat Pengajuan
        </h3>
      </div>

      <div v-if="!requests.length" class="p-12 text-center">
        <div class="text-5xl mb-3">📅</div>

        <h3 class="text-lg font-semibold text-gray-700">
          Belum Ada Request
        </h3>

        <p class="text-gray-500 mt-2">
          Pengajuan reschedule akan muncul di sini.
        </p>
      </div>

      <div
        v-for="item in requests"
        :key="item.id"
        class="border-b last:border-b-0 p-5 hover:bg-gray-50 transition"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-semibold text-gray-800">
              {{ item.studentName || item.student }}
            </h4>

            <p class="text-sm text-gray-500 mt-1">
              {{ item.alasan }}
            </p>
          </div>

          <span
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="{
              'bg-orange-100 text-orange-700':
                item.status === 'Menunggu',
              'bg-green-100 text-green-700':
                item.status === 'Disetujui',
              'bg-red-100 text-red-700':
                item.status === 'Ditolak'
            }"
          >
            {{ item.status }}
          </span>
        </div>

        <div
          class="grid md:grid-cols-2 gap-4 mt-4 text-sm text-gray-600"
        >
          <div>
            <span class="font-medium">
              Tanggal:
            </span>

            {{ item.tanggal }}
          </div>

          <div>
            <span class="font-medium">
              Jam:
            </span>

            {{ item.jam }}
          </div>
        </div>

        <div
          v-if="item.jadwalPengganti"
          class="mt-4 bg-green-50 border border-green-100 rounded-xl p-4"
        >
          <p
            class="font-semibold text-green-700 mb-2"
          >
            Jadwal Pengganti
          </p>

          <p class="text-sm text-green-600">
            {{ item.jadwalPengganti.tanggal }}
            •
            {{ item.jadwalPengganti.jam }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>