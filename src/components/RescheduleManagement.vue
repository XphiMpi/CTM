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
  <div class="space-y-4">
    <div
      v-for="item in reschedules"
      :key="item.id"
      class="bg-white rounded-xl p-5"
    >
      <h3 class="font-bold">
        {{ item.student }}
      </h3>

      <p>
        {{ item.alasan }}
      </p>

      <p
        class="text-sm text-gray-500"
      >
        {{ item.status }}
      </p>

      <div class="flex gap-2 mt-3">
        <button
          @click="
            $emit(
              'approve',
              item
            )
          "
          class="bg-green-600 text-white px-4 py-2 rounded"
        >
          Approve
        </button>

        <button
          @click="
            $emit(
              'reject',
              item.id
            )
          "
          class="bg-red-600 text-white px-4 py-2 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
</template>