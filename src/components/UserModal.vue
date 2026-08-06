<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  user: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  "close",
  "save",
]);

const form = ref({
  nama: "",
  email: "",
  phone: "",
  role: "teacher",
});

watch(
  () => props.user,
  (value) => {
    if (value) {
      form.value = { ...value };
    } else {
      form.value = {
        nama: "",
        email: "",
        phone: "",
        role: "teacher",
      };
    }
  },
  { immediate: true }
);

const submit = () => {
  if (
    !form.value.nama ||
    !form.value.email
  ) {
    alert("Nama dan email wajib diisi");
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
          {{ user ? "Edit User" : "Tambah User" }}
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
            Nama
          </label>

          <input
            v-model="form.nama"
            class="w-full border rounded-lg p-3"
            placeholder="Nama User"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm">
            Email
          </label>

          <input
            type="email"
            v-model="form.email"
            class="w-full border rounded-lg p-3"
            placeholder="user@email.com"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm">
            No HP
          </label>

          <input
            v-model="form.phone"
            class="w-full border rounded-lg p-3"
            placeholder="08123456789"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm">
            Role
          </label>

          <select
            v-model="form.role"
            class="w-full border rounded-lg p-3"
          >
            <option value="admin">
              Admin
            </option>

            <option value="teacher">
              Teacher
            </option>

            <option value="monitor">
              Monitor
            </option>

            <option value="parent">
              Parent
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