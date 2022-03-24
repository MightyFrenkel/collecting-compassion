<script lang="ts">
import { RouterView } from 'vue-router';
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    window.devicePixelRatio = 1.0;
  }
})
</script>

<template>
  <RouterView class="bg-black text-white min-h-screen overscroll-none" />
</template>

<style>
@import '@/assets/base.css';
</style>
