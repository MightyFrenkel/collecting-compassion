import type { Socket } from "socket.io-client";
<script lang="ts">
import { io, Socket } from "socket.io-client";
import { defineComponent } from "vue";
export default defineComponent({
    data() {
        return {
            socket: null as null | Socket,
            status: "",
            latestImg: null as any,
            extraClass: 'opacity-100'
        }
    },
    mounted() {
        this.socket = io();

        this.socket.on("connect", () => {
            console.log("connected", this.socket?.id);
            this.status = "connected";
        });

        this.socket.on("disconnect", () => {
            console.log("disconnected", this.socket?.id); // undefined
            this.status = "disconnected";
        });
        this.socket.on("newimage", (data: any) => {
            console.log(data);
            this.latestImg = data;
            this.extraClass = "opacity-100";
            setTimeout(() => {
                this.extraClass = "opacity-0";
            }, 5000)
        });
    }
})
</script>

<template>
  <div class="bg-black flex items-center justify-center max-h-screen">
      <img v-if="latestImg" :class="'transition-opacity duration-1000 ' + extraClass"  :src="latestImg.url" />
  </div>
</template>
