<script setup>
defineProps({
  students: Array,
});

defineEmits(["add", "edit", "delete"]);
</script>

<template>
  <div class="space-y-5">
    <!-- Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">Total Student</p>
        <p class="text-3xl font-bold text-blue-600 mt-2">
          {{ students?.length || 0 }}
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">Student Aktif</p>

        <p class="text-3xl font-bold text-green-600 mt-2">
          {{
            students?.filter(
              (item) => item.status === "Aktif"
            ).length || 0
          }}
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm text-gray-500">Student Non Aktif</p>

        <p class="text-3xl font-bold text-red-500 mt-2">
          {{
            students?.filter(
              (item) => item.status !== "Aktif"
            ).length || 0
          }}
        </p>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-5 border-b border-gray-100"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-800">
            Student Management
          </h2>

          <p class="text-sm text-gray-500">
            Kelola data siswa yang terdaftar
          </p>
        </div>

        <button
          @click="$emit('add')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Tambah Student
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-600"
              >
                ID
              </th>

              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-600"
              >
                Nama
              </th>

              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-600"
              >
                Kelas
              </th>

              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-600"
              >
                Status
              </th>

              <th
                class="px-6 py-4 text-right text-sm font-semibold text-gray-600"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="student in students"
              :key="student.id"
              class="border-t hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 font-medium text-gray-700">
                {{ student.studentId }}
              </td>

              <td class="px-6 py-4 font-medium text-gray-800">
                {{ student.nama }}
              </td>

              <td class="px-6 py-4 text-gray-600">
                {{ student.kelas }}
              </td>

              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="
                    student.status === 'Aktif'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  "
                >
                  {{ student.status }}
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <button
                    @click="$emit('edit', student)"
                    class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    Edit
                  </button>

                  <button
                    @click="$emit('delete', student.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!students?.length">
              <td
                colspan="5"
                class="text-center py-10 text-gray-400"
              >
                Belum ada data student
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>