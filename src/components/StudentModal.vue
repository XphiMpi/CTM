<script setup>
import { ref, watch } from "vue";
import { CLASS_OPTIONS } from "@/services/classService";

const props = defineProps({
  show: Boolean,
  student: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  "close",
  "save",
]);

const form = ref({
  studentId: "",
  nama: "",
  kelas: "",
  status: "Aktif",
});

watch(
  () => props.student,
  (value) => {
    if (value) {
      form.value = { ...value };
    } else {
      form.value = {
        studentId: "",
        nama: "",
        kelas: "",
        status: "Aktif",
      };
    }
  },
  { immediate: true }
);

const submit = () => {
  if (
    !form.value.studentId ||
    !form.value.nama ||
    !form.value.kelas
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
    class="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-xl w-125 p-6 shadow-lg">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-lg font-bold">
          {{ student ? "Edit Student" : "Tambah Student" }}
        </h2>

        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block mb-1 text-sm">
            Student ID
          </label>

          <input
            v-model="form.studentId"
            class="w-full border rounded-lg p-3"
            placeholder="STD-0001"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm">
            Nama Student
          </label>

          <input
            v-model="form.nama"
            class="w-full border rounded-lg p-3"
            placeholder="Nama Student"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm">
            Kelas
          </label>

          <select
            v-model="form.kelas"
            class="w-full border rounded-lg p-3"
          >
            <option value="">
              Pilih Kelas
            </option>

            <option
              v-for="kelas in CLASS_OPTIONS"
              :key="kelas"
              :value="kelas"
            >
              {{ kelas }}
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1 text-sm">
            Status
          </label>

          <select
            v-model="form.status"
            class="w-full border rounded-lg p-3"
          >
            <option value="Aktif">
              Aktif
            </option>

            <option value="Nonaktif">
              Nonaktif
            </option>
          </select>
        </div>

        <button
          @click="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>