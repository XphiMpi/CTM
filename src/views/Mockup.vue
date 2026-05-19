<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goStart = () => {
  router.push("/RoleSelect");
};
</script>

<template>
  <section class="relative min-h-screen overflow-hidden bg-black text-white">
    <!-- Background -->
    <div
      class="absolute inset-0 bg-cover bg-center scale-105"
      style="background-image: url('/hero.png')"
    ></div>

    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-linear-to-r from-[#071133]/80 via-black/35 to-black/20"
    ></div>

    <!-- Blue Glow -->
    <div
      class="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#0C37D3]/30 blur-3xl sm:h-96 sm:w-96"
    ></div>

    <!-- Content -->
    <div class="relative z-10 flex min-h-screen flex-col">
      <!-- Navbar -->
      <nav class="flex items-center justify-between px-6 py-5 sm:px-10 md:px-16">
        <div>
          <h1 class="text-xl font-bold tracking-wide text-[#FFEBB7] sm:text-2xl">
            CTM
          </h1>

          <p class="mt-1 text-[9px] tracking-[0.22em] text-white/55 sm:text-[11px] sm:tracking-[0.28em]">
            COURSE TEACHER MANAGEMENT
          </p>
        </div>
      </nav>

      <!-- Hero -->
      <main class="flex flex-1 items-center px-6 py-10 sm:px-10 md:px-16">
        <div class="w-full max-w-xl">
          <p class="mb-4 text-[10px] font-semibold tracking-[0.28em] text-[#DCA122] sm:text-xs sm:tracking-[0.35em]">
            SMART • SIMPLE • RELIABLE
          </p>

          <h2 class="max-w-xl text-3xl font-bold leading-tight sm:text-3xl md:text-4xl">
            Modern Platform For
            <span class="mt-2 block text-[#FFEBB7]">
              Course Teacher Management
            </span>
          </h2>

          <p class="mt-5 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Manage attendance, schedules, students, teachers, and reports
            through one integrated monitoring platform.
          </p>

          <!-- Button -->
          <div class="mt-8 flex w-full sm:w-auto">
            <button
              @click="goStart"
              class="w-full rounded-full border border-[#DCA122]/40 bg-[#0C37D3]/45 px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-2xl shadow-[#0C37D3]/30 transition duration-300 hover:bg-[#1248ff] active:scale-95 sm:w-72"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>

      <!-- Bottom Info -->
      <div class="px-6 pb-2 sm:px-10 md:px-16">
        <div
          class="grid max-w-5xl grid-cols-1 gap-5 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <h3 class="text-sm font-semibold text-[#FFEBB7] sm:text-base">
              Role Based
            </h3>

            <p class="mt-2 text-xs leading-relaxed text-white/55 sm:text-sm">
              Separate access for teacher, student, and parent.
            </p>
          </div>

          <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <h3 class="text-sm font-semibold text-[#FFEBB7] sm:text-base">
              Real-Time Monitoring
            </h3>

            <p class="mt-2 text-xs leading-relaxed text-white/55 sm:text-sm">
              Attendance and activity monitored instantly.
            </p>
          </div>

          <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <h3 class="text-sm font-semibold text-[#FFEBB7] sm:text-base">
              Secure Platform
            </h3>

            <p class="mt-2 text-xs leading-relaxed text-white/55 sm:text-sm">
              Firebase authentication and cloud database support.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>