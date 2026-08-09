<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  request: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "approve"]);

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
  { immediate: true },
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
        <h2 class="text-xl font-bold">Approval Reschedule</h2>

        <button @click="$emit('close')">✕</button>
      </div>

      <div class="space-y-4">
        <input
          v-model="form.tanggal"
          type="date"
          class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          v-model="form.jam"
          type="time"
          class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          v-model="form.alasan"
          rows="4"
          placeholder="Catatan untuk siswa..."
          class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div class="flex justify-end gap-3">
          <button
            @click="$emit('close')"
            class="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            Batal
          </button>

          <button
            @click="submit"
            class="px-5 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
          >
            Simpan & Setujui
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
