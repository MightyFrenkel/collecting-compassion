import type p5 from "p5";
<script lang="ts">
import { getAllImages } from "@/services/modules/ImageService";
import { defineComponent } from "@vue/runtime-core";
import p5 from "p5";
import { io, Socket } from "socket.io-client";
import type { Image } from "@/models/image";

export default defineComponent({
    data() {
        return {
            images: [] as any[],
            socket: null as null | Socket,
            status: "disconnected",
            canvas: null as HTMLCanvasElement | null,
            ctx: null as CanvasRenderingContext2D | null,
            p: null as p5 | null,
            filter: ""
        }
    },
    async mounted() {
        this.socket = io();
        this.filter = this.$route.params.filter as string;
        
        this.socket.on("connect", () => {
            console.log("connected", this.socket?.id);
            this.status = "connected";
        });

        this.socket.on("disconnect", () => {
            console.log("disconnected", this.socket?.id); // undefined
            this.status = "disconnected";
        });

        this.images = await getAllImages(this.filter);

        let loadedImages: p5.Image[] = [];

        this.socket.on("newimage", (data: Image) => {
            
            if (this.filter.length > 0 && data.color !== this.filter) return;
            console.log(data);
            this.images.push(data);
            if (this.p && data.base64) 
                loadedImages.push(this.p?.loadImage(data.base64));
        });

        let h = 0;

        const sketch = (p: p5) => {
            p.setup = () => {
                const renderer = p.createCanvas(480, 480);
                p.background('black');
                p.frameRate(10);
                this.canvas = document.getElementById(renderer.id()) as HTMLCanvasElement;

                this.ctx = this.canvas?.getContext("2d");
                p.resizeCanvas(window.innerWidth, window.innerHeight, true);
                for (let i = 0; i < this.images.length; i++) {
                    loadedImages.push(p.loadImage(this.images[i].url));
                }
                h = p.height / 2;
            };

            p.draw = () => {
                p.background(0);
                for (let i = 0; i < loadedImages.length; i++) {
                    const img = loadedImages[i];
                    h = h - 0.05;
                    if (h < 0)
                        h = p.height;
                    p.image(img, h, 0);
                }
            };
            p.windowResized = () => {
                p.resizeCanvas(window.innerWidth, window.innerHeight, true);
            }
        };

        this.p = new p5(sketch, this.$refs.p5container as HTMLElement);
    }
})

</script>

<template>
    <div>
        <div class="fixed">
            <h1>This is the total view</h1>
            <p>Connection status: {{ status }}</p>
        </div>

        <div ref="p5container"></div>
    </div>
</template>