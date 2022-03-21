<script lang="ts">
import { sendImage } from "@/services/modules/ImageService";
import { defineComponent } from "@vue/runtime-core";

import p5 from "p5";

export default defineComponent({
  data() {
    return {
      imgSrc: "",
      images: [] as any[],
      canvas: null as HTMLCanvasElement | null,
      ctx: null as CanvasRenderingContext2D | null,
      feedback: "",
      p: null as p5 | null
    }
  },
  methods: {
    clearCanvas() {
      this.p?.clear(0, 0, 0, 0);
    },
    send() {
      this.feedback = "";
      const dataUrl = this.canvas?.toDataURL("image/png");
      
      if (!dataUrl) return;
      sendImage(dataUrl)
        .then(response => {
          console.log(response);
          this.clearCanvas();
          this.feedback = "succesfully send!"
        })
        .catch(error => {
          console.log(error);
          this.feedback = "ERROR";
        })
    }
  },
  mounted() {
    const sketch = (p: p5) => {
      p.setup = () => {
        const renderer = p.createCanvas(400, 400);
        p.background('#FFF');
        this.canvas = document.getElementById(renderer.id()) as HTMLCanvasElement;
        this.ctx = this.canvas?.getContext("2d");
        p.resizeCanvas(window.innerWidth, window.innerHeight, true);
      };

      p.draw = () => {
        p.stroke(p.color(0, 0, 240));
        p.strokeWeight(5);
        if (p.mouseIsPressed === true) {
          p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY,);
        }
      };
      p.windowResized = () => {
        console.log("resize");
        p.resizeCanvas(window.innerWidth, window.innerHeight, true);
      }
    };
    
    this.p = new p5(sketch);
  },
})
</script>

<template>
  <div class>
    <h1>This is the draw page</h1>
    <button
      class="px-16 py-8 border rounded-xl shadow bg-blue-500 text-white font-bold text-2xl"
      @click="send"
    >Send</button>
    <p>{{ feedback }}</p>
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
