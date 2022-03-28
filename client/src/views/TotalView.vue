import type { Vector2 } from "@/models/vector2";
import type { Drawing } from "@/models/drawing";
import type p5 from "p5";
<script lang="ts">
import { getAllImages } from "@/services/modules/ImageService";
import { defineComponent } from "@vue/runtime-core";
import p5 from "p5";

import { io, Socket } from "socket.io-client";
import type { Image } from "@/models/image";
import { Drawing } from "@/models/drawing";
import type { Vector2 } from "@/models/vector2";

export default defineComponent({
    data() {
        return {
            images: [] as Image[],
            socket: null as null | Socket,
            status: "disconnected",
            canvas: null as HTMLCanvasElement | null,
            ctx: null as CanvasRenderingContext2D | null,
            p: null as p5 | null,
            filter: "",
            currentGridSpot: 0
        }
    },
    methods: {
        createDrawing(imgUrl: string | undefined, startPos: Vector2): Drawing {
            if (!this.p || !imgUrl) {
                throw Error("Can not create drawing");
            };
            const image = this.p?.loadImage(imgUrl);
            const drawing = new Drawing(startPos, image);
            return drawing;
        },
        setupSocket() {
            const socket = io();
            socket.on("connect", () => {
                console.log("connected", this.socket?.id);
                this.status = "connected";
            });

            socket.on("disconnect", () => {
                console.log("disconnected", this.socket?.id); // undefined
                this.status = "disconnected";
            });
            return socket;
        },
        animateDrawing(drawing: Drawing, sizePercentage: number = 1) {
            const moveSpeed = 0.0003;
            const moveAreaPercentage = 0.1;
            if (!this.p) return;
            if (drawing.distance() < 0.01) {
                drawing.targetPos = {
                    x: drawing.startPos.x + this.p.random(-moveAreaPercentage, moveAreaPercentage),
                    y: drawing.startPos.y + + this.p.random(-moveAreaPercentage, moveAreaPercentage)
                }
            }
            const size = this.p.width / 5 * sizePercentage;
            const offset = size / 2;
            const img = drawing.image;
            const normDir = drawing.normDirection();
            drawing.currentPos = {
                x: drawing.currentPos.x + normDir.x * moveSpeed,
                y: drawing.currentPos.y + normDir.y * moveSpeed
            }
            if (img)
                this.p.image(img, this.p.width * drawing.currentPos.x - offset, this.p.height * drawing.currentPos.y - offset, size, size);
        },
    },
    async mounted() {

        this.filter = this.$route.params.filter as string;
        this.socket = this.setupSocket();

        this.images = await getAllImages(this.filter);
        console.log(this.images);

        let loadedDrawings: Drawing[] = [];

        const grid: Vector2[] = [
            { x: 0.25, y: 0.25, },
            { x: 0.50, y: 0.25, },
            { x: 0.75, y: 0.25, },
            { x: 0.25, y: 0.75, },
            { x: 0.50, y: 0.75, },
            { x: 0.75, y: 0.75, }
        ]

        this.socket.on("newimage", (data: Image) => {

            if (this.filter.length > 0 && data.color !== this.filter) return;
            console.log(data);
            this.images.push(data);
            if (this.p && data.base64) {
                const drawing = this.createDrawing(data.base64, grid[this.currentGridSpot]);
                this.currentGridSpot++;
                if (this.currentGridSpot >= grid.length)
                    this.currentGridSpot = 0;
                loadedDrawings.push(drawing);
            }
        });

        const sketch = (p: p5) => {
            p.setup = () => {
                this.p = p;
                const renderer = p.createCanvas(480, 480);
                p.background('black');
                p.frameRate(24);

                this.canvas = document.getElementById(renderer.id()) as HTMLCanvasElement;

                this.ctx = this.canvas?.getContext("2d");
                p.resizeCanvas(window.innerWidth, window.innerHeight, true);

                for (let i = 0; i < 20; i++) {
                    for (let i = 0; i < this.images.length; i++) {
                        if (loadedDrawings.length > 2000) break;
                        const randomPos: Vector2 = {
                            x: p.random(0.1, 0.9),
                            y: p.random(0.1, 0.9)
                        }
                        const drawing = this.createDrawing(this.images[i].url, randomPos);
                        this.currentGridSpot++;
                        if (this.currentGridSpot >= grid.length)
                            this.currentGridSpot = 0;
                        loadedDrawings.push(drawing);
                    }
                }
                console.log("Loaded " + loadedDrawings.length + " drawings");

            };

            p.draw = () => {
                //p.blendMode('source-over');
                p.background(0);
                //p.blendMode('overlay');
                for (let i = 0; i < loadedDrawings.length; i++) {
                    const drawing = loadedDrawings[i];
                    // const size =  (i / 2) / loadedDrawings.length * 2;

                    this.animateDrawing(drawing);
                }
            };
            p.windowResized = () => {
                p.resizeCanvas(window.innerWidth, window.innerHeight, false);
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