<script lang="ts">
import type { Image } from "@/models/image";
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
      p: null as p5 | null,
      color: 'blue'
    }
  },
  methods: {
    clearCanvas() {
      this.p?.clear(0, 0, 0, 0);
    },
    send() {
      this.feedback = "";

      const img = this.createImage();

      sendImage(img)
        .then(response => {
          console.log(response);
          this.clearCanvas();
          this.feedback = "succesfully send!"
        })
        .catch(error => {
          console.log(error);
          this.feedback = "ERROR";
        })
    },
    createImage(): Image {
      const dataUrl = this.canvas?.toDataURL("image/png");
      return {
        base64: dataUrl,
        color: this.color
      } as Image
    }
  },
  mounted() {
    // if (this.p) return;
    const sketch = (p: p5) => {
      p.setup = () => {
        const renderer = p.createCanvas(480, 480);

        this.canvas = document.getElementById(renderer.id()) as HTMLCanvasElement;

        this.ctx = this.canvas?.getContext("2d");
      };

      p.draw = () => {
        p.stroke(this.color);
        p.strokeWeight(5);

        if (p.mouseIsPressed === true) {
          p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY,);
        }
      };
    };

    this.p = new p5(sketch, this.$refs.p5container as HTMLElement);
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
    <br />
    <input type="radio" id="yellow" name="color" value="yellow" v-model="color" />
    <label for="yellow">Yellow</label>
    <br />
    <input type="radio" id="blue" name="color" value="blue" v-model="color" />
    <label for="blue">Blue</label>
    <br />
    <p>{{ feedback }}</p>
    <div ref="p5container"></div>
  </div>
</template>

<style>
</style>
