<script setup>
defineProps({
  users: Array,
});

defineEmits(["add", "edit", "delete"]);
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
    <!-- Header -->
    <div
      class="flex items-center justify-between p-5 border-b border-gray-100"
    >
      <div>
        <h2 class="text-lg font-semibold text-gray-800">
          User Management
        </h2>

        <p class="text-sm text-gray-500">
          Kelola data admin, teacher, dan parent
        </p>
      </div>

      <button
        @click="$emit('add')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        + Tambah User
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="text-left px-6 py-4 text-sm font-semibold text-gray-600"
            >
              Nama
            </th>

            <th
              class="text-left px-6 py-4 text-sm font-semibold text-gray-600"
            >
              Email
            </th>

            <th
              class="text-left px-6 py-4 text-sm font-semibold text-gray-600"
            >
              Role
            </th>

            <th
              class="text-right px-6 py-4 text-sm font-semibold text-gray-600"
            >
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4 font-medium text-gray-800">
              {{ user.nama }}
            </td>

            <td class="px-6 py-4 text-gray-600">
              {{ user.email }}
            </td>

            <td class="px-6 py-4">
              <span
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-red-100 text-red-700':
                    user.role === 'admin',
                  'bg-blue-100 text-blue-700':
                    user.role === 'teacher',
                  'bg-green-100 text-green-700':
                    user.role === 'parent'
                }"
              >
                {{ user.role }}
              </span>
            </td>

            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <button
                  @click="$emit('edit', user)"
                  class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm transition"
                >
                  Edit
                </button>

                <button
                  @click="$emit('delete', user.id)"
                  class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!users?.length">
            <td
              colspan="4"
              class="text-center py-10 text-gray-400"
            >
              Belum ada data user
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
