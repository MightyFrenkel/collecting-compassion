import type { Socket } from "socket.io-client";
<script lang="ts">
import { io, Socket } from "socket.io-client";
import { defineComponent } from "vue";
export default defineComponent({
    data() {
        return {
            socket: null as null | Socket,
            status: "",
            latestImg: null as any
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
        });
    }
})
</script>

<template>
<h1> The latest image is the following: </h1>
  <div>
      <img v-if="latestImg" :src="latestImg.url" />
  </div>
</template>
