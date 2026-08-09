<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  children: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  studentId: "",
  tanggal: "",
  jam: "",
  alasan: "",
});

watch(
  () => props.show,
  () => {
    form.value = {
      studentId: "",
      tanggal: "",
      jam: "",
      alasan: "",
    };
  },
);

const submit = () => {
  if (
    !form.value.studentId ||
    !form.value.tanggal ||
    !form.value.jam ||
    !form.value.alasan
  ) {
    alert("Lengkapi semua data");
    return;
  }

  emit("save", form.value);
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
      <div class="bg-linear-to-r from-[#0C37D3] to-[#108EDC] p-5 text-white">
        <h2 class="text-xl font-bold">Reschedule Request</h2>

        <p class="text-blue-100 text-sm">Ajukan perubahan jadwal</p>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block mb-2 text-sm font-medium"> Pilih Anak </label>

          <select
            v-model="form.studentId"
            class="w-full border border-gray-200 rounded-xl p-3"
          >
            <option value="">Pilih Anak</option>

            <option
              v-for="child in children"
              :key="child.studentId"
              :value="child.studentId"
            >
              {{ child.nama }} ({{ child.studentId }})
            </option>
          </select>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium"> Tanggal </label>

          <input
            v-model="form.tanggal"
            type="date"
            class="w-full border border-gray-200 rounded-xl p-3"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium"> Jam </label>

          <input
            v-model="form.jam"
            type="time"
            class="w-full border border-gray-200 rounded-xl p-3"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium"> Alasan </label>

          <textarea
            v-model="form.alasan"
            rows="4"
            placeholder="Tuliskan alasan pengajuan"
            class="w-full border border-gray-200 rounded-xl p-3"
          />
        </div>

        <div class="flex justify-end gap-3">
          <button @click="$emit('close')" class="px-5 py-3 rounded-xl border">
            Batal
          </button>

          <button
            @click="submit"
            class="px-5 py-3 rounded-xl bg-[#0C37D3] text-white"
          >
            Kirim Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
