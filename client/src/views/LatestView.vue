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
            extraClass: 'opacity-100',
            timeOut: null as null | number
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
            if (this.timeOut)
                clearTimeout(this.timeOut);
            this.timeOut = setTimeout(() => {
                this.extraClass = "opacity-0";
                this.latestImg = null;
            }, 20000)
        });
    }
})
</script>

<template>
  <div class="bg-black flex flex-col items-center justify-center max-h-screen text-7xl font-light relative">
      <img v-if="latestImg" :class="'transition-opacity h-full duration-1000 ' + extraClass"  :src="latestImg.url" />
      <img v-else class="h-3/5 animate-pulse move" src="/img/TV-screen.png" />
  </div>
</template>
<style>
.move {
    animation-name: grow;
    animation-duration: 400s;
    animation-iteration-count: infinite;
}

@keyframes grow {
    0% {
        transform:scale(1.2);
    }
    50% {
        transform:scale(1.5);    
    }
    100% {
        transform:scale(1.2);
    }
}
</style>