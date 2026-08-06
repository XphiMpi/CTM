<script setup>
defineProps({
  reschedules: Array,
});

defineEmits([
  "approve",
  "reject",
]);
</script>

<template>
  <div>
    <div
      v-if="!reschedules?.length"
      class="bg-white rounded-2xl shadow-sm p-10 text-center"
    >
      <div class="text-5xl mb-4">📅</div>

      <h3 class="text-lg font-semibold text-gray-700">
        Belum Ada Pengajuan Reschedule
      </h3>

      <p class="text-gray-500 mt-2">
        Pengajuan reschedule akan muncul di sini setelah dibuat oleh user.
      </p>
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <div
        v-for="item in reschedules"
        :key="item.id"
        class="bg-white rounded-xl p-5 shadow-sm"
      >
        <h3 class="font-bold">
          {{ item.student }}
        </h3>

        <p>
          {{ item.alasan }}
        </p>

        <p class="text-sm text-gray-500">
          {{ item.status }}
        </p>
      </div>
    </div>
  </div>
</template>