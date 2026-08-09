<script setup>
defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
  activeMenu: String,
  roleLabel: String,
  isOpen: Boolean,
});

defineEmits(["change-menu", "logout", "close"]);
</script>

<template>
  <div>
    <!-- Overlay Mobile -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
    />

    <!-- Sidebar -->
    <aside
      class="fixed md:static top-0 left-0 h-dvh overflow-y-auto w-56
             bg-linear-to-b from-[#123fc4] to-[#06216d]
             text-white flex flex-col z-50
             transition-transform duration-300 ease-in-out"
      :class="[
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      ]"
    >
      <div class="p-5 flex items-center justify-between">
        <h1 class="font-bold text-sm">
          Course Teacher Management
        </h1>

        <button
          @click="$emit('close')"
          class="md:hidden text-xl"
        >
          ✕
        </button>
      </div>

      <div class="px-4 mb-4">
        <div
          class="bg-yellow-400 text-black rounded-full py-2 text-center text-xs font-bold"
        >
          {{ roleLabel }}
        </div>
      </div>

      <nav class="flex-1 px-3 overflow-y-auto">
        <button
          v-for="menu in menus"
          :key="menu"
          @click="
            $emit('change-menu', menu);
            $emit('close');
          "
          class="w-full text-left px-4 py-3 rounded-lg mb-2"
          :class="
            activeMenu === menu
              ? 'bg-yellow-400 text-black'
              : 'hover:bg-white/10'
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
  </div>
</template>