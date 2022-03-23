<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col justify-center items-center text-4xl font-semibold gap-4">
    <router-link class="hover:underline" to="/draw">Draw</router-link>
    <router-link class="hover:underline" to="/total">Total</router-link>
    <router-link class="hover:underline text-yellow-500" to="/total/yellow">Yellow</router-link>
    <router-link class="hover:underline text-blue-500" to="/total/blue">Blue</router-link>
    <router-link class="hover:underline" to="/latest">Latest</router-link>
  </div>
</template>
