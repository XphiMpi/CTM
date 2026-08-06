<script setup>
defineProps({
  attendance: Array,
});

defineEmits(["add", "edit", "delete"]);
</script>

<template>
  <div class="bg-white rounded-xl">
    <table class="w-full">
      <thead>
        <tr>
          <th>Siswa</th>
          <th>Kelas</th>
          <th>Tanggal</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in attendance" :key="item.id">
          <td>
            {{ item.studentName }}
          </td>

          <td>
            {{ item.kelas }}
          </td>

          <td>
            {{ item.tanggal }}
          </td>

          <td>
            {{ item.status }}
          </td>
          <td>
            <button
              @click="$emit('edit', item)"
              class="bg-green-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      @click="$emit('add')"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      + Attendance
    </button>
  </div>
</template>
