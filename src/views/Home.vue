<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/hello')
  const data = await res.json()
  console.log(data)
})
</script>
<template>
  <div class="p-10 text-2xl font-bold">
    Vue + Tailwind + Firebase Ready 🚀
  </div>
</template>
