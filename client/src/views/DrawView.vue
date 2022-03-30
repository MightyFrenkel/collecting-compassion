<script lang="ts">
import ColorPicker from "@/components/ColorPicker.vue";
import ThrashIcon from "@/components/icons/TrashIcon.vue";
import Popup from "@/components/Popup.vue";
import type { Image } from "@/models/image";
import { sendImage } from "@/services/modules/ImageService";
import { defineComponent } from "@vue/runtime-core";
import type { Vector2 } from "@/models/vector2";

import p5 from "p5";

export default defineComponent({
  components: {
    ColorPicker,
    ThrashIcon,
    Popup
  },
  props: {
    maxPoints: {
      default: 10
    }
  },
  data() {
    return {
      imgSrc: "",
      images: [] as any[],
      canvas: null as HTMLCanvasElement | null,
      ctx: null as CanvasRenderingContext2D | null,
      feedback: "",
      p: null as p5 | null,
      color: "blue",
      empty: true,
      password: "1234",
      pwPopupOpen: true,
      startingPoints: [] as Vector2[],
      previousPoints: [] as Vector2[]
    };
  },
  methods: {
    clearCanvas() {
      this.p?.clear(0, 0, 0, 0);
      this.empty = true;
      this.feedback = "";
    },
    send() {
      this.feedback = "";
      try {
        const img = this.createImage();
        sendImage(img, this.password)
          .then(response => {
            console.log(response);
            this.clearCanvas();
            this.feedback = "succesfully send!";
          })
          .catch(error => {
            console.log(error);
            this.feedback = error;
          });
      }
      catch (error) {
        console.log(error);
      }
    },
    createImage(): Image {
      console.log(this.empty);
      if (this.empty) {
        const errorMsg = "Drawing is empty, can not send";
        this.feedback = errorMsg;
        throw Error(errorMsg);
      }
      const dataUrl = this.canvas?.toDataURL("image/png");
      return {
        base64: dataUrl,
        color: this.color
      } as Image;
    },
    storePreviousPoint(point: Vector2) {
      if (this.startingPoints.length < this.maxPoints) {
        this.startingPoints.push(point);
      }
      else {
        this.previousPoints.push(point);
        if (this.previousPoints.length > this.maxPoints) {
          this.previousPoints.shift();
        }
      }
    },
    drawAllPoints() {
      if (!this.p) return;
      for (let i = 1; i < this.startingPoints.length; i++) {
        const point = this.startingPoints[i];
        const ppoint = this.startingPoints[i - 1];
        this.p.strokeWeight(i * 3);
        this.p.line(point.x, point.y, ppoint.x, ppoint.y);
      }
      for (let i = 0; i < this.previousPoints.length; i++) {
        const point = this.previousPoints[i];
        if (this.previousPoints.length >= this.maxPoints && i == 0) continue;
        const ppoint = (i == 0 && this.previousPoints.length < this.maxPoints) ? this.startingPoints[this.startingPoints.length - 1] : this.previousPoints[i - 1];

        this.p.strokeWeight((this.previousPoints.length - i) * 3);
        this.p.line(point.x, point.y, ppoint.x, ppoint.y);
      }
    },
    applyMask() {
      const img = this.createImage();
      if (!this.p || !img.base64) return;
      const p = this.p;
      this.p.loadImage(img.base64, (mask) => {
        // console.log(mask);
        // const overlay = p.createImage(p.width, p.height);
        // overlay.loadPixels();
        // for (let x = 0; x < overlay.width; x++) {
        //   for (let y = 0; y < overlay.height; y++) {
        //     let a = p.map(y, 0, overlay.height, 255, 0);
        //     overlay.set(x, y, [246, 255, 0, a]);
        //   }
        // }
        // overlay.updatePixels();
        // overlay.mask(mask);
        // mask.loadPixels();
        mask.loadPixels();
        for (let x = 0; x < mask.width; x++) {
          for (let y = 0; y < mask.height; y++) {
            let a = p.map(y, 0, mask.height, 255, 0);
            
            console.log(mask.get(x, y));
          }
        }
        p.updatePixels();
        p.image(mask, 0, 0);


        // p.image(overlay, 0, 0);

      });

    },
    distance(p1: Vector2, p2: Vector2) {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    },
    difference(p1: Vector2, p2: Vector2) {
      return {
        x: (p1.x - p2.x),
        y: (p1.y - p2.y)
      }
    }
  },
  mounted() {
    const sketch = (p: p5) => {

      p.setup = () => {
        const renderer = p.createCanvas(480, 480);
        renderer.class("border border-black absolute");
        this.canvas = document.getElementById(renderer.id()) as HTMLCanvasElement;
        this.ctx = this.canvas?.getContext("2d");
        p.windowResized();
      };
      p.touchMoved = () => {
        this.color == "blue" ? p.stroke(0, 170, 255) : p.stroke(246, 255, 0);
        p.strokeCap('round')
        if (p.mouseIsPressed === true) {
          this.storePreviousPoint({ x: p.mouseX, y: p.mouseY });
          this.drawAllPoints();
          this.empty = false;
        }
        p.strokeWeight(0);
        
        return false;
      };

      p.touchEnded = () => {
        this.previousPoints = [];
        this.startingPoints = [];
        // this.applyMask();
      }

      p.windowResized = () => {
        if (this.canvas?.parentElement)
          p.resizeCanvas(this.canvas?.parentElement?.offsetWidth, this.canvas?.parentElement?.offsetHeight, false);
      }
    };
    this.p = new p5(sketch, this.$refs.p5container as HTMLElement);
  },

})
</script>

<template>
  <div class="bg-white text-gray-900 flex flex-col h-screen">
    <Popup :isOpen="pwPopupOpen">
      <div class="flex items-center gap-x-4 text-2xl font-semibold py-6">
        <label>password:</label>
        <input type="password" v-model="password" class="bg-white border border-black h-20" />
      </div>
      <button
        class="px-8 py-4 bg-blue-500 rounded-xl text-white text-2xl"
        @click="pwPopupOpen = false"
      >Set Password</button>
    </Popup>
    <button class="w-full py-4 shadow bg-blue-500 text-white font-bold text-2xl" @click="send">Send</button>
    <p>{{ feedback }}</p>

    <div class="flex h-full">
      <ColorPicker
        :active="color == 'blue'"
        color="rgb(1, 92, 188)"
        class="w-1/6"
        @click="color = 'blue'"
      />
      <div ref="p5container" class="relative w-4/6 mx-auto">
        <div class="absolute flex justify-center w-full m-4">
          <div class="bg-gray-400 rounded-full cursor-pointer z-10" @click="clearCanvas">
            <ThrashIcon class="w-24 h-24 p-6 text-gray-100" />
          </div>
        </div>
      </div>
      <ColorPicker
        :flip="true"
        :active="color == 'yellow'"
        color="rgb(255, 213, 4)"
        class="w-1/6"
        @click="color = 'yellow'"
      />
    </div>
  </div>
</template>

<style>
</style>
