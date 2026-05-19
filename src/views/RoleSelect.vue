<script setup>
import { useRouter } from 'vue-router'
const r = useRouter()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0C37D3]">
    <div class="bg-white w-105 p-10 rounded-2xl shadow-2xl">
      <h1 class="text-3xl font-bold text-center mb-8">Select Login Role !</h1>

      <div class="space-y-4">
        <button
          @click="r.push('/login/teacher')"
          class="w-full py-3 bg-[#108EDC] text-white rounded-lg border-b-4 border-[#DCA122]">
          Teacher
        </button>

        <button
          @click="r.push('/login/parent')"
          class="w-full py-3 bg-[#108EDC] text-white rounded-lg border-b-4 border-[#DCA122]">
          Parent
        </button>

        <button
          @click="r.push('/login/student')"
          class="w-full py-3 bg-[#108EDC] text-white rounded-lg border-b-4 border-[#DCA122]">
          Student
        </button>
      </div>
    </div>
  </div>
</template>