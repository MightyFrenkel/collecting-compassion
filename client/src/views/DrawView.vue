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
      color: 'blue',
      empty: true,
      password: '1234'
    }
  },
  methods: {
    clearCanvas() {
      this.p?.clear(0, 0, 0, 0);
      this.empty = true;
    },
    send() {
      this.feedback = "";
      try {
        const img = this.createImage();

        sendImage(img, this.password)
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
      catch (error) {
        console.log(error);
      }
    },
    createImage(): Image {
      console.log(this.empty);
      if (this.empty) {
        throw Error("Drawing is empty, can not send");
      }
      const dataUrl = this.canvas?.toDataURL("image/png");
      return {
        base64: dataUrl,
        color: this.color
      } as Image
    }
  },
  mounted() {
    const sketch = (p: p5) => {
      p.setup = () => {
        const renderer = p.createCanvas(480, 480);
        renderer.class("border border-white");
        this.canvas = document.getElementById(renderer.id()) as HTMLCanvasElement;

        this.ctx = this.canvas?.getContext("2d");
      };

      p.touchMoved = () => {
        if (this.color == 'blue') {
          p.stroke(0, 170, 255)
        }
        else {
          p.stroke(246, 255, 0)
        }

        p.strokeWeight(10);

        if (p.mouseIsPressed === true) {
          p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY,);
          this.empty = false;
        }
        return false;
      };
    };

    this.p = new p5(sketch, this.$refs.p5container as HTMLElement);
  },
})
</script>

<template>
  <div>
    <h1>This is the draw page</h1>
    <div class="flex">
      <label>password:</label>
      <input type="text" v-model="password" class="bg-black border border-white" />
    </div>
    <button
      class="px-16 py-8 border rounded-xl shadow bg-blue-500 text-white font-bold text-2xl"
      @click="send"
    >Send</button>
    <button
      class="px-16 py-8 border rounded-xl shadow bg-red-500 text-white font-bold text-2xl"
      @click="clearCanvas"
    >Clear</button>
    <br />
    <input type="radio" id="yellow" name="color" value="yellow" v-model="color" />
    <label for="yellow">Yellow</label>
    <br />
    <input type="radio" id="blue" name="color" value="blue" v-model="color" />
    <label for="blue">Blue</label>
    <br />
    <p>{{ feedback }}</p>
    <div ref="p5container" class="flex items-center justify-center"></div>
  </div>
</template>

<style>
</style>
