<script setup>
defineProps({
  attendance: Array,
  children: Array,
});
</script>

<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-5">
      <h2 class="font-bold">
        Data Anak
      </h2>

      <div
        v-for="child in children"
        :key="child.id"
      >
        {{ child.nama }}
      </div>
    </div>

    <div class="bg-white rounded-xl p-5">
      <h2 class="font-bold">
        Kehadiran
      </h2>

      <div
        v-for="item in attendance"
        :key="item.id"
      >
        {{ item.tanggal }}
        -
        {{ item.status }}
      </div>
    </div>
  </div>
</template>