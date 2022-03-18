<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

import axios from "axios";

export default defineComponent({
  data() {
    return {
      imgSrc: "",
      images: [] as any[]
    }
  },
  methods: {
    clickCanvas(event: any) {
      const rect = event.target.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      const canvas = this.$refs.canvas as HTMLCanvasElement;

      var ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillRect(x, y, 10, 10);
      
      axios.post('/api/image/new', 
      {
        base64: canvas.toDataURL()
      })
    },
  },
  mounted() {   

  },
})
</script>

<template>
  <div>
    <h1>This is the draw page</h1>
    <canvas ref="canvas" class="border border-black" @click="clickCanvas"> </canvas>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
