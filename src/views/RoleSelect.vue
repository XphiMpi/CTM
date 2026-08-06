<script setup>
import { useRouter } from "vue-router";

const r = useRouter();

const roles = [
  {
    title: "Teacher Portal",
    desc: "Manage classes, attendance, schedules, assignments, and student progress.",
    route: "/login/teacher",
    icon: "👨‍🏫",
  },
  {
    title: "Family Portal",
    desc: "Monitor attendance, grades, reports, and learning activities for your children.",
    route: "/login/parent",
    icon: "👨‍👩‍👧",
  },
];
</script>

<template>
  <section
    class="relative min-h-screen overflow-hidden bg-[#001B8F] text-white"
  >
    <!-- Background -->
    <div
      class="absolute inset-0 bg-linear-to-br from-[#0C37D3] via-[#0525A6] to-[#00145C]"
    ></div>

    <!-- Glow Effects -->
    <div
      class="absolute -left-25 top-24 h-72 w-72 rounded-full bg-[#2D6BFF]/30 blur-3xl"
    ></div>

    <div
      class="absolute bottom-0 -right-30 h-96 w-96 rounded-full bg-[#DCA122]/10 blur-3xl"
    ></div>

    <div
      class="absolute bottom-10 left-0 h-56 w-56 rounded-full bg-white/5"
    ></div>

    <!-- Content -->
    <div
      class="relative z-10 flex min-h-screen items-center justify-center px-6 py-10"
    >
      <div class="w-full max-w-5xl">
        <!-- Header -->
        <div class="text-center">
          <div
            class="inline-flex rounded-full bg-[#DCA122] px-5 py-2 text-xs font-semibold tracking-wide text-black"
          >
            LOGIN PORTAL
          </div>

          <h1
            class="mt-6 text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            Select Your Role
          </h1>

          <p
            class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base"
          >
            Access the Course Teacher Management platform using your
            designated portal. Students can access learning information
            through the Family Portal.
          </p>
        </div>

        <!-- Cards -->
        <div
          class="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2"
        >
          <button
            v-for="role in roles"
            :key="role.title"
            @click="r.push(role.route)"
            class="group rounded-3xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#DCA122]/50 hover:bg-white/10 hover:shadow-2xl"
          >
            <div
              class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DCA122]/20 text-3xl"
            >
              {{ role.icon }}
            </div>

            <h2
              class="mt-6 text-xl font-semibold text-[#FFEBB7]"
            >
              {{ role.title }}
            </h2>

            <p
              class="mt-3 text-sm leading-relaxed text-white/70"
            >
              {{ role.desc }}
            </p>

            <div
              class="mt-6 flex items-center text-sm font-medium text-[#DCA122]"
            >
              Continue
              <span
                class="ml-2 transition-transform duration-300 group-hover:translate-x-2"
              >
                →
              </span>
            </div>
          </button>
        </div>

        <!-- Back Button -->
        <div class="mt-10 flex justify-center">
          <button
            @click="r.push('/')"
            class="rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:bg-white/10"
          >
            Back to Home
          </button>
        </div>

        <!-- Footer -->
        <div class="mt-10 text-center text-xs text-white/40">
          Course Teacher Management System
        </div>
      </div>
    </div>
  </section>
</template>