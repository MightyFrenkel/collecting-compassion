<script lang="ts">
import { getAllImages } from "@/services/modules/ImageService";
import { defineComponent } from "@vue/runtime-core";
import { io, Socket } from "socket.io-client";

export default defineComponent({
    data() {
        return {
            images: [] as any[],
            socket: null as null | Socket,
            status: "disconnected"
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

        this.socket.on("events", (data: any) => {
            console.log(data);
            this.images.push(data);
        });

        getAllImages()
            .then(images => {
                this.images = images;
            })
    }
})

</script>

<template>
    <div>
        <h1>This is the total view</h1>
        <p>Connection status: {{ status }}</p>
        <div v-for="(image, index) in images" :key="index">
            <img :src="image.base64" />
        </div>
    </div>
</template>