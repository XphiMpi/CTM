<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  show: Boolean,
  attendance: {
    type: Object,
    default: null,
  },
  students: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "close",
  "save",
]);

const form = ref({
  studentId: "",
  studentName: "",
  kelas: "",
  tanggal: "",
  status: "Hadir",
});

watch(
  () => props.attendance,
  (value) => {
    if (value) {
      form.value = { ...value };
    } else {
      form.value = {
        studentId: "",
        studentName: "",
        kelas: "",
        tanggal: new Date()
          .toISOString()
          .slice(0, 10),
        status: "Hadir",
      };
    }
  },
  { immediate: true }
);

const selectedStudent = computed(() =>
  props.students.find(
    (s) =>
      s.studentId === form.value.studentId
  )
);

watch(
  selectedStudent,
  (student) => {
    if (!student) return;

    form.value.studentName =
      student.nama;

    form.value.kelas =
      student.kelas;
  }
);

const submit = () => {
  if (!form.value.studentId) {
    alert("Pilih siswa");
    return;
  }

  emit("save", form.value);
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-xl w-125 p-6"
    >
      <div
        class="flex justify-between items-center mb-5"
      >
        <h2 class="font-bold text-lg">
          {{
            attendance
              ? "Edit Attendance"
              : "Tambah Attendance"
          }}
        </h2>

        <button
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label
            class="block text-sm mb-1"
          >
            Student
          </label>

          <select
            v-model="form.studentId"
            class="w-full border rounded-lg p-3"
          >
            <option value="">
              Pilih Student
            </option>

            <option
              v-for="student in students"
              :key="student.id"
              :value="
                student.studentId
              "
            >
              {{ student.nama }}
              -
              {{ student.kelas }}
            </option>
          </select>
        </div>

        <div>
          <label
            class="block text-sm mb-1"
          >
            Kelas
          </label>

          <input
            v-model="form.kelas"
            readonly
            class="w-full border rounded-lg p-3 bg-gray-100"
          />
        </div>

        <div>
          <label
            class="block text-sm mb-1"
          >
            Tanggal
          </label>

          <input
            type="date"
            v-model="form.tanggal"
            class="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label
            class="block text-sm mb-1"
          >
            Status
          </label>

          <select
            v-model="form.status"
            class="w-full border rounded-lg p-3"
          >
            <option value="Hadir">
              Hadir
            </option>

            <option value="Izin">
              Izin
            </option>

            <option value="Alfa">
              Alfa
            </option>
          </select>
        </div>

        <button
          @click="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>