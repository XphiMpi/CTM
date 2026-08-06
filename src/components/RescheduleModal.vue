<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  request: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  "close",
  "approve",
]);

const form = ref({
  tanggalPengganti: "",
  jamPengganti: "",
  kelasPengganti: "",
  catatan: "",
});

watch(
  () => props.request,
  () => {
    form.value = {
      tanggalPengganti: "",
      jamPengganti: "",
      kelasPengganti: "",
      catatan: "",
    };
  },
  { immediate: true }
);

const submit = () => {
  emit("approve", {
    requestId: props.request.id,
    ...form.value,
  });
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div class="bg-white w-137.5 rounded-xl p-6">
      <div class="flex justify-between mb-5">
        <h2 class="text-lg font-bold">
          Approve Reschedule
        </h2>

        <button @click="$emit('close')">
          ✕
        </button>
      </div>

      <div class="space-y-4">
        <input
          v-model="form.tanggalPengganti"
          type="date"
          class="w-full border rounded-lg p-3"
        />

        <input
          v-model="form.jamPengganti"
          type="time"
          class="w-full border rounded-lg p-3"
        />

        <input
          v-model="form.kelasPengganti"
          placeholder="Kelas Pengganti"
          class="w-full border rounded-lg p-3"
        />

        <textarea
          v-model="form.catatan"
          rows="3"
          placeholder="Catatan"
          class="w-full border rounded-lg p-3"
        />

        <button
          @click="submit"
          class="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Approve
        </button>
      </div>
    </div>
  </div>
</template>