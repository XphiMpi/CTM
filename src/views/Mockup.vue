<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goStart = () => {
  router.push("/RoleSelect");
};
</script>

<template>
  <section
    class="relative min-h-screen overflow-hidden bg-[#001B8F] text-white"
  >
    <!-- Background Image -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      style="background-image: url('/hero.png')"
    ></div>

    <!-- Blue Overlay -->
    <div
      class="absolute inset-0 bg-linear-to-br from-[#0C37D3]/95 via-[#002CB7]/90 to-[#00145C]/95"
    ></div>

    <!-- Glow Effect -->
    <div
      class="absolute -left-30 top-1/3 h-72 w-72 rounded-full bg-[#0C37D3]/40 blur-3xl"
    ></div>

    <!-- Decorative Circle -->
    <div
      class="absolute bottom-8 -left-10 h-44 w-44 rounded-full bg-white/5"
    ></div>

    <div
      class="absolute bottom-16 right-6 h-52 w-52 rounded-full bg-white/5"
    ></div>

    <!-- Content -->
    <div class="relative z-10 flex min-h-screen flex-col">
      <!-- Navbar -->
      <nav class="px-6 py-6 sm:px-10 md:px-16">
        <div class="flex items-center gap-3">

          <h1
            class="text-lg font-semibold text-[#DCA122] sm:text-2xl"
          >
            Course Teacher Management
          </h1>
        </div>
      </nav>

      <!-- Hero -->
      <main
        class="flex flex-1 items-center px-6 py-12 sm:px-10 md:px-16"
      >
        <div class="w-full max-w-3xl">
          <!-- Badge -->
          <div
            class="inline-flex rounded-full bg-[#DCA122] px-6 py-3 text-xs font-medium text-black shadow-lg sm:px-8 sm:text-sm"
          >
            <span class="block font-semibold text-white">
              Platform Pembelajaran Terpadu
            </span>
          </div>

          <!-- Heading -->
          <h2
            class="mt-8 text-4xl leading-tight sm:text-5xl md:text-6xl"
          >
            <span class="block font-light text-white">
              Belajar Lebih
            </span>

            <span
              class="mt-2 block font-semibold text-[#DCA122]"
            >
              Cerdas & Menyenangkan
            </span>
          </h2>

          <!-- Description -->
          <p
            class="mt-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg"
          >
            Solusi manajemen belajar terpadu untuk siswa SD hingga
            SMA. Pantau perkembangan, absensi dan nilai secara
            real-time melalui satu platform yang modern dan mudah
            digunakan.
          </p>

          <!-- Button -->
          <div class="mt-8">
            <button
              @click="goStart"
              class="rounded-full bg-[#DCA122] px-6 py-3 text-xs font-semibold text-black shadow-lg transition duration-300 hover:scale-105 hover:bg-[#f3ba33] sm:px-8 sm:py-3 sm:text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>

      <!-- Bottom Features -->
      <div class="px-6 pb-6 sm:px-10 md:px-16">
        <div
          class="grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
          >
            <h3 class="text-sm font-semibold text-[#DCA122]">
              Role Based
            </h3>
            <p class="mt-2 text-xs text-white/70 sm:text-sm">
              Separate access for teacher, student, and parent.
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
          >
            <h3 class="text-sm font-semibold text-[#DCA122]">
              Real-Time Monitoring
            </h3>
            <p class="mt-2 text-xs text-white/70 sm:text-sm">
              Attendance and activity monitored instantly.
            </p>
          </div>

          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
          >
            <h3 class="text-sm font-semibold text-[#DCA122]">
              Secure Platform
            </h3>
            <p class="mt-2 text-xs text-white/70 sm:text-sm">
              Firebase authentication and cloud database support.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>