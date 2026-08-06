<script setup>
defineProps({
  stats: Object,
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
    <!-- Student -->
    <div
      class="bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-blue-100">
            Total Student
          </p>

          <h2 class="text-4xl font-bold mt-2">
            {{ stats.students }}
          </h2>
        </div>

        <div
          class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl"
        >
          🎓
        </div>
      </div>

      <p class="mt-4 text-xs text-blue-100">
        Student terdaftar
      </p>
    </div>

    <!-- User -->
    <div
      class="bg-linear-to-r from-purple-600 to-purple-500 text-white rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-purple-100">
            Total User
          </p>

          <h2 class="text-4xl font-bold mt-2">
            {{ stats.users }}
          </h2>
        </div>

        <div
          class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl"
        >
          👥
        </div>
      </div>

      <p class="mt-4 text-xs text-purple-100">
        User aktif sistem
      </p>
    </div>

    <!-- Attendance -->
    <div
      class="bg-linear-to-r from-green-600 to-green-500 text-white rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-green-100">
            Attendance
          </p>

          <h2 class="text-4xl font-bold mt-2">
            {{ stats.attendance }}
          </h2>
        </div>

        <div
          class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl"
        >
          ✅
        </div>
      </div>

      <p class="mt-4 text-xs text-green-100">
        Data kehadiran
      </p>
    </div>

    <!-- Reschedule -->
    <div
      class="bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-orange-100">
            Pending Reschedule
          </p>

          <h2 class="text-4xl font-bold mt-2">
            {{ stats.pendingReschedule }}
          </h2>
        </div>

        <div
          class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl"
        >
          🔄
        </div>
      </div>

      <p class="mt-4 text-xs text-orange-100">
        Menunggu persetujuan
      </p>
    </div>
  </div>
</template>