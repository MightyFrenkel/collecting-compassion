<script lang="ts">
import ColorPicker from "@/components/ColorPicker.vue";
import ThrashIcon from "@/components/icons/TrashIcon.vue";
import Popup from "@/components/Popup.vue";
import type { Image } from "@/models/image";
import { sendImage } from "@/services/modules/ImageService";
import { defineComponent } from "@vue/runtime-core";

import p5 from "p5";

export default defineComponent({
  components: {
    ColorPicker,
    ThrashIcon,
    Popup
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
      pwPopupOpen: true
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
        if (this.color == "blue") {
          p.stroke(0, 170, 255);
        }
        else {
          p.stroke(246, 255, 0);
        }
        p.strokeWeight(10);
        if (p.mouseIsPressed === true) {
          p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
          this.empty = false;
        }
        return false;
      };
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
      <button class="px-8 py-4 bg-blue-500 rounded-xl text-white text-2xl" @click="pwPopupOpen = false">Set Password</button>
    </Popup>
    <button class="w-full py-8 shadow bg-blue-500 text-white font-bold text-2xl" @click="send">Send</button>
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
