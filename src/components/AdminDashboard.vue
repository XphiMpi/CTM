<script setup>
defineProps({
  stats: Object,
});
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <div class="bg-white p-5 rounded-xl">
      <p>Total Student</p>
      <h1 class="text-3xl font-bold">
        {{ stats.students }}
      </h1>
    </div>

    <div class="bg-white p-5 rounded-xl">
      <p>Total User</p>
      <h1 class="text-3xl font-bold">
        {{ stats.users }}
      </h1>
    </div>

    <div class="bg-white p-5 rounded-xl">
      <p>Attendance</p>
      <h1 class="text-3xl font-bold">
        {{ stats.attendance }}
      </h1>
    </div>

    <div class="bg-white p-5 rounded-xl">
      <p>Pending Reschedule</p>
      <h1 class="text-3xl font-bold">
        {{ stats.pendingReschedule }}
      </h1>
    </div>
  </div>
</template>