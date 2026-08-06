<script setup>
defineProps({
  menus: Array,
  activeMenu: String,
  roleLabel: String,
});

defineEmits(["change-menu", "logout"]);
</script>

<template>
  <aside
    class="w-56 bg-linear-to-b from-[#123fc4] to-[#06216d] text-white flex flex-col"
  >
    <div class="p-5">
      <h1 class="font-bold">Course Teacher Management</h1>
    </div>

    <div class="px-4 mb-4">
      <div
        class="bg-yellow-400 text-black rounded-full py-2 text-center text-xs font-bold"
      >
        {{ roleLabel }}
      </div>
    </div>

    <nav class="flex-1 px-3">
      <button
        v-for="menu in menus"
        :key="menu"
        @click="$emit('change-menu', menu)"
        class="w-full text-left px-4 py-3 rounded-lg mb-2"
        :class="
          activeMenu === menu ? 'bg-yellow-400 text-black' : 'hover:bg-white/10'
        "
      >
        {{ menu }}
      </button>
    </nav>

    <div class="p-3">
      <button
        @click="$emit('logout')"
        class="w-full bg-white/10 rounded-lg p-3"
      >
        Logout
      </button>
    </div>
  </aside>
</template>
