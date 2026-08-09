<script setup>
import { computed } from "vue";

const props = defineProps({
  students: Array,
});

const sortedStudents = computed(() => {
  return [...(props.students || [])].sort((a, b) =>
    (a.studentId || "").localeCompare(b.studentId || "")
  );
});

defineEmits(["add", "edit", "delete"]);
</script>

<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- Total Student -->
      <div
        class="bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      >
        <p class="text-sm opacity-80">Total Student</p>
        <p class="text-4xl font-bold mt-3">
          {{ students?.length || 0 }}
        </p>
      </div>

      <!-- Student Aktif -->
      <div
        class="bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      >
        <p class="text-sm opacity-80">Student Aktif</p>
        <p class="text-4xl font-bold mt-3">
          {{
            students?.filter(
              (item) => item.status === "Aktif"
            ).length || 0
          }}
        </p>
      </div>

      <!-- Student Non Aktif -->
      <div
        class="bg-linear-to-br from-red-500 to-rose-600 text-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      >
        <p class="text-sm opacity-80">Student Non Aktif</p>
        <p class="text-4xl font-bold mt-3">
          {{
            students?.filter(
              (item) => item.status !== "Aktif"
            ).length || 0
          }}
        </p>
      </div>
    </div>

    <!-- Main Card -->
    <div
      class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
    >
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-6 border-b border-gray-100"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            Student Management
          </h2>

          <p class="text-sm text-gray-500 mt-1">
            Kelola data siswa yang terdaftar
          </p>
        </div>

        <button
          @click="$emit('add')"
          class="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          + Tambah Student
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                ID
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Nama
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Kelas
              </th>

              <th
                class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Status
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
              v-for="student in sortedStudents"
              :key="student.id"
              class="border-b border-gray-100 even:bg-slate-50/50 hover:bg-blue-50 transition-all duration-200"
            >
              <!-- Student ID -->
              <td class="px-6 py-4">
                <span
                  class="font-semibold text-blue-600"
                >
                  {{ student.studentId }}
                </span>
              </td>

              <!-- Nama -->
              <td class="px-6 py-4">
                <div>
                  <p class="font-semibold text-gray-800">
                    {{ student.nama }}
                  </p>
                </div>
              </td>

              <!-- Kelas -->
              <td class="px-6 py-4 text-gray-600">
                {{ student.kelas }}
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
                  :class="
                    student.status === 'Aktif'
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-rose-100 text-rose-700 border-rose-200'
                  "
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="
                      student.status === 'Aktif'
                        ? 'bg-emerald-500'
                        : 'bg-rose-500'
                    "
                  >
                  </span>

                  {{ student.status }}
                </span>
              </td>

              <!-- Action -->
              <td class="px-6 py-4">
                <div class="flex justify-end gap-3">
                  <button
                    @click="$emit('edit', student)"
                    class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Edit
                  </button>

                  <button
                    @click="$emit('delete', student.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!students?.length">
              <td colspan="5" class="py-16">
                <div
                  class="flex flex-col items-center justify-center text-center"
                >
                  <div
                    class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4"
                  >
                    📚
                  </div>

                  <h3 class="text-lg font-semibold text-gray-700">
                    Belum Ada Data Student
                  </h3>

                  <p class="text-sm text-gray-400 mt-1">
                    Silakan tambahkan student baru untuk memulai.
                  </p>

                  <button
                    @click="$emit('add')"
                    class="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
                  >
                    Tambah Student
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>