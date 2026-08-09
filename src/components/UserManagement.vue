<script setup>
defineProps({
  users: Array,
});

defineEmits(["add", "edit", "delete"]);
</script>

<template>
  <div
    class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
  >
    <!-- Header -->
    <div
      class="px-8 py-6 border-b border-gray-100 bg-linear-to-r from-slate-50 to-blue-50"
    >
     <div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">User Management</h2>

          <p class="text-sm text-gray-500 mt-1">
            Kelola data admin, teacher, dan parent
          </p>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th
              class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              User
            </th>

            <th
              class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Email
            </th>

            <th
              class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Role
            </th>

            <th
              class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-gray-100 even:bg-slate-50/50 hover:bg-blue-50 transition-all duration-200"
          >
            <!-- User -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-11 h-11 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow"
                >
                  {{ user.nama?.charAt(0).toUpperCase() }}
                </div>

                <div>
                  <p class="font-semibold text-gray-800">
                    {{ user.nama }}
                  </p>

                  <p class="text-xs text-gray-400">ID #{{ user.id }}</p>
                </div>
              </div>
            </td>

            <!-- Email -->
            <td class="px-6 py-4 text-gray-600">
              {{ user.email }}
              <p
                class="text-xs mt-1"
                :class="
                  user.status === 'inactive'
                    ? 'text-red-500'
                    : 'text-emerald-500'
                "
              >
                {{ user.status || "active" }}
              </p>
            </td>

            <!-- Role -->
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
                :class="{
                  'bg-red-100 text-red-700 border-red-200':
                    user.role === 'admin',

                  'bg-blue-100 text-blue-700 border-blue-200':
                    user.role === 'teacher',

                  'bg-green-100 text-green-700 border-green-200':
                    user.role === 'parent',
                }"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-red-500': user.role === 'admin',
                    'bg-blue-500': user.role === 'teacher',
                    'bg-green-500': user.role === 'parent',
                  }"
                ></span>

                {{ user.role }}
              </span>
            </td>

            <!-- Action -->
            <td class="px-6 py-4">
              <div class="flex justify-end gap-3">
                <button
                  @click="$emit('edit', user)"
                  class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Edit
                </button>

                <button
                  @click="$emit('delete', user.id)"
                  class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-sm font-medium shadow-md"
                >
                  Nonaktifkan
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="!users?.length">
            <td colspan="4" class="py-16">
              <div
                class="flex flex-col items-center justify-center text-center"
              >
                <div
                  class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4"
                >
                  👥
                </div>

                <h3 class="text-lg font-semibold text-gray-700">
                  Belum Ada Data User
                </h3>

                <p class="text-sm text-gray-400 mt-1">
                  Belum ada pengguna yang melakukan registrasi.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
