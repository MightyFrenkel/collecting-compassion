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
  <RouterView class="bg-black text-white h-screen overscroll-none" />
</template>

<style>
@import '@/assets/base.css';
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap');

#app {
  font-family: 'Source Sans Pro', sans-serif;
}

</style>
