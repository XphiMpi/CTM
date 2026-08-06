<script setup>
defineProps({
  user: Object,
  roleLabel: String,
});
</script>

<template>
  <header
    class="h-16 bg-white border-b px-6 flex justify-between items-center"
  >
    <div>
      <p class="text-xs text-blue-500">
        Selamat Datang
      </p>

      <h2 class="font-semibold">
        {{ user?.nama }}
      </h2>
    </div>

    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white"
      >
        {{ user?.nama?.charAt(0) }}
      </div>

      <div>
        <p class="text-sm font-medium">
          {{ user?.nama }}
        </p>

        <p
          class="text-xs text-blue-600"
        >
          {{ roleLabel }}
        </p>
      </div>
    </div>
  </header>
</template>