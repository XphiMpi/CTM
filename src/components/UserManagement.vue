<script setup>
defineProps({
  users: Array,
});

defineEmits(["add", "edit", "delete"]);
</script>

<template>
  <div class="bg-white rounded-xl">
    <table class="w-full">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Email</th>
          <th>Role</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.nama }}</td>

          <td>{{ user.email }}</td>

          <td>{{ user.role }}</td>

          <td>
            <button
              @click="$emit('delete', user.id)"
              class="bg-red-500 px-3 py-1 text-white rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      @click="$emit('add')"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      + User
    </button>
  </div>
</template>
