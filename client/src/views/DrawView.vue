<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

import axios from "axios";
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
    // drawCanvas(event: any) {
    //   const rect = event.target.getBoundingClientRect();
    //   let x = event.clientX - rect.left;
    //   let y = event.clientY - rect.top;

    //   this.ctx?.fillRect(x, y, 10, 10);

    // },
    clearCanvas() {
      // this.ctx?.clearRect(0, 0, 300, 150)
      this.p?.clear(0, 0, 0, 0);
    },
    sendImage() {
      this.feedback = "";
      axios.post('/api/image/new',
        {
          base64: this.canvas?.toDataURL()
        })
        .catch(error => {
          console.log(error);
          this.feedback = "ERROR";
        })
        .then(response => {
          console.log(response);
          this.clearCanvas();
          this.feedback = "succesfully send!"
        })

    }
  },
  mounted() {
    // this.canvas = this.$refs.canvas as HTMLCanvasElement;
    // this.ctx = this.canvas?.getContext("2d");
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
      @click="sendImage"
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
