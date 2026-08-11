<script setup>
defineProps({
  user: Object,
  roleLabel: String,
});

defineEmits(["toggle-sidebar"]);
</script>

<template>
  <header
    class="sticky top-[env(safe-area-inset-top)] z-20 min-h-20 px-4 md:px-6 py-3 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-200"
  >
    <!-- Left -->
    <div class="flex items-center gap-3">

      <!-- Hamburger Mobile -->
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden text-2xl font-bold text-slate-700"
      >
        ☰
      </button>

      <!-- Welcome Admin / Teacher -->
      <div v-if="roleLabel !== 'ORANG TUA'">
        <p
          class="text-xs uppercase tracking-widest text-blue-600 font-semibold"
        >
          Selamat Datang
        </p>

        <h2 class="text-lg md:text-2xl font-bold text-slate-800 mt-1">
          {{ user?.nama || "User" }}
        </h2>
      </div>

      <!-- Welcome Parent -->
      <div v-else>
        <p class="text-xs md:text-sm text-blue-600 font-semibold">
          Selamat datang
        </p>

        <h2 class="text-lg md:text-2xl font-bold text-slate-800">
          Bapak/Ibu Wali Murid
        </h2>

        <p class="hidden md:block text-xs text-slate-500 mt-1">
          Pantau kehadiran dan aktivitas belajar anak Anda.
        </p>
      </div>

    </div>


    <!-- Right -->
    <div
      class="flex items-center gap-2 md:gap-4 bg-white rounded-2xl px-3 md:px-4 py-2 shadow-md border border-slate-100"
    >

      <!-- Avatar -->
      <div
        class="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
      >
        {{ user?.nama?.charAt(0)?.toUpperCase() || "U" }}
      </div>


      <!-- User Info -->
      <div class="hidden md:block">

        <p class="text-sm font-semibold text-slate-800">
          {{ user?.nama || "User" }}
        </p>

        <div class="flex items-center gap-2 mt-1">

          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>

          <p class="text-xs font-medium text-slate-500">
            {{ roleLabel }}
          </p>

        </div>

      </div>

    </div>

  </header>
</template>