<script setup>
defineProps({
  students: Array,
});

defineEmits(["add", "edit", "delete"]);
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm">
    <div class="p-5 border-b flex justify-between">
      <h2 class="font-bold">Student Management</h2>

      <button
        @click="$emit('add')"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Student
      </button>
    </div>

    <table class="w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>Kelas</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>
            {{ student.studentId }}
          </td>

          <td>
            {{ student.nama }}
          </td>

          <td>
            {{ student.kelas }}
          </td>

          <td>
            {{ student.status }}
          </td>

          <td>
            <button
              @click="$emit('delete', student.id)"
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
            <button
              @click="$emit('edit', student)"
              class="bg-green-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
