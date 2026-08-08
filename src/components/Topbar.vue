<script setup>
defineProps({
  user: Object,
  roleLabel: String,
});
</script>

<template>
  <header
    class="sticky top-0 z-20 h-20 px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-200"
  >
    <!-- Left -->
    <div>
      <p
        class="text-xs uppercase tracking-widest text-blue-600 font-semibold"
      >
        Selamat Datang
      </p>

      <h2
        class="text-2xl font-bold text-slate-800 mt-1"
      >
        {{ user?.nama || "User" }}
      </h2>
    </div>

    <!-- Right -->
    <div
      class="flex items-center gap-4 bg-white rounded-2xl px-4 py-2 shadow-md border border-slate-100"
    >
      <!-- Avatar -->
      <div
        class="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
      >
        {{ user?.nama?.charAt(0)?.toUpperCase() }}
      </div>

      <!-- User Info -->
      <div>
        <p
          class="text-sm font-semibold text-slate-800"
        >
          {{ user?.nama }}
        </p>

        <div class="flex items-center gap-2 mt-1">
          <span
            class="w-2 h-2 rounded-full bg-emerald-500"
          ></span>

          <p
            class="text-xs font-medium text-slate-500"
          >
            {{ roleLabel }}
          </p>
        </div>
      </div>
    </div>
  </header>
</template>