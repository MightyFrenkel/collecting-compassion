import type { Drawing } from "@/models/drawing";
import type p5 from "p5";
<script lang="ts">
import { getAllImages } from "@/services/modules/ImageService";
import { defineComponent } from "@vue/runtime-core";
import p5 from "p5";
import { io, Socket } from "socket.io-client";
import type { Image } from "@/models/image";
import { Drawing } from "@/models/drawing";

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

        let loadedImages: Drawing[] = [];

        this.socket.on("newimage", (data: Image) => {

            if (this.filter.length > 0 && data.color !== this.filter) return;
            console.log(data);
            this.images.push(data);
            if (this.p && data.base64) {
                const image = this.p?.loadImage(data.base64);
                const drawing = new Drawing();
                drawing.image = image;
                loadedImages.push(drawing);
            }
        });

        const grid = [
            { x: 0.25, y: 0.25, },
            { x: 0.50, y: 0.25, },
            { x: 0.75, y: 0.25, },
            { x: 0.25, y: 0.75, },
            { x: 0.50, y: 0.75, },
            { x: 0.75, y: 0.75, }
        ]

        const sketch = (p: p5) => {
            p.setup = () => {
                const renderer = p.createCanvas(480, 480);
                p.background('black');
                p.frameRate(10);
                this.canvas = document.getElementById(renderer.id()) as HTMLCanvasElement;

                this.ctx = this.canvas?.getContext("2d");
                p.resizeCanvas(window.innerWidth, window.innerHeight, true);

                let gridSpot = 0;
                for (let i = 0; i < this.images.length; i++) {
                    const image = p.loadImage(this.images[i].url);
                    const drawing = new Drawing();
                    drawing.image = image;
                    drawing.startPos = grid[gridSpot];
                    drawing.currentPos = drawing.startPos;
                    gridSpot++;
                    if (gridSpot > grid.length)
                        gridSpot = 0;
                    loadedImages.push(drawing);
                }

            };

            p.draw = () => {
                p.background(0);
                for (let i = 0; i < loadedImages.length; i++) {
                    const img = loadedImages[i];
                    if (!img.image) continue;
                    const size = p.width / 5;
                    p.image(img.image, p.width * img.startPos.x - size / 2, p.height * img.startPos.y - size / 2, size, size);
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