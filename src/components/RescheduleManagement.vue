<script setup>
defineProps({
  reschedules: Array,
});

defineEmits([
  "approve",
  "edit-schedule",
  "reject",
]);
</script>

<template>
  <div>
    <!-- Empty State -->
    <div
      v-if="!reschedules?.length"
      class="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center"
    >
      <div class="text-6xl mb-4">
        📅
      </div>

      <h3 class="text-xl font-bold text-slate-700">
        Belum Ada Pengajuan Reschedule
      </h3>

      <p class="text-slate-500 mt-2">
        Pengajuan reschedule akan muncul di sini.
      </p>
    </div>

    <!-- List -->
    <div
      v-else
      class="grid gap-5"
    >
      <div
        v-for="item in reschedules"
        :key="item.id"
        class="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div>
              <h3
                class="text-lg font-bold text-slate-800"
              >
                {{ item.studentName || item.student }}
              </h3>

              <p
                class="text-sm text-slate-500 mt-1"
              >
                {{ item.studentId }}
              </p>
            </div>

            <span
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="{
                'bg-yellow-100 text-yellow-700':
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

          <!-- Content -->
          <div
            class="grid md:grid-cols-2 gap-4 mt-5"
          >
            <div
              class="bg-slate-50 rounded-2xl p-4"
            >
              <p
                class="text-xs font-semibold text-slate-500 uppercase"
              >
                Tanggal
              </p>

              <p
                class="font-semibold text-slate-800 mt-1"
              >
                {{ item.tanggal }}
              </p>
            </div>

            <div
              class="bg-slate-50 rounded-2xl p-4"
            >
              <p
                class="text-xs font-semibold text-slate-500 uppercase"
              >
                Jam
              </p>

              <p
                class="font-semibold text-slate-800 mt-1"
              >
                {{ item.jam }}
              </p>
            </div>
          </div>

          <div
            class="bg-blue-50 rounded-2xl p-4 mt-4"
          >
            <p
              class="text-xs font-semibold text-blue-600 uppercase"
            >
              Alasan
            </p>

            <p
              class="text-sm text-slate-700 mt-2"
            >
              {{ item.alasan }}
            </p>
          </div>

          <!-- Actions -->
          <div
            v-if="item.status === 'Menunggu'"
            class="flex flex-wrap justify-end gap-3 mt-6"
          >
            <button
              @click="$emit('approve', item)"
              class="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow"
            >
              ✅ Accept
            </button>

            <button
              @click="$emit('approve', item)"
              class="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"
            >
              🕒 Ubah Jadwal
            </button>

            <button
              @click="$emit('reject', item.id)"
              class="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow"
            >
              ❌ Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>