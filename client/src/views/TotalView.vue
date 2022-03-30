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
import { easeOutCirc } from "@/helpers/Easing";

export default defineComponent({
    props: {
        moveSpeed: {
            default: 0.000225
        },
        moveAreaPercentage: {
            default: 0.1
        },
        frameRate: {
            default: 6
        },
        maxDrawings: {
            default: 150
        }
    },
    data() {
        return {
            loadedDrawings: [] as Drawing[],
            socket: null as null | Socket,
            status: "disconnected",
            frameRateFeedback: 0,
            canvas: null as HTMLCanvasElement | null,
            ctx: null as CanvasRenderingContext2D | null,
            p: null as p5 | null,
            filter: "",
            overlays: [] as any[]
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
            if (!this.p) return;
            if (drawing.distance() < 0.01) {
                drawing.targetPos = {
                    x: drawing.startPos.x + this.p.random(-this.moveAreaPercentage, this.moveAreaPercentage),
                    y: drawing.startPos.y + + this.p.random(-this.moveAreaPercentage, this.moveAreaPercentage)
                }
            }
            const img = drawing.image;
            if (!img) return;
            const width = img.width / 1.5 * sizePercentage;
            const height = img.height / 1.5 * sizePercentage;
            
            const normDir = drawing.normDirection();
            drawing.currentPos = {
                x: drawing.currentPos.x + normDir.x * this.moveSpeed,
                y: drawing.currentPos.y + normDir.y * this.moveSpeed
            }
            
                this.p.image(img, this.p.width * drawing.currentPos.x - width / 2, this.p.height * drawing.currentPos.y - height / 2, width, height);
        },
        addDrawing(drawing: Drawing) {
            if (this.loadedDrawings.length >= this.maxDrawings) {
                this.loadedDrawings.shift();
            }
            this.loadedDrawings.push(drawing);

        },
        getRandomPos() {
            if (this.p) {
                return {
                    x: this.p.random(0.1, 0.9),
                    y: this.p.random(0.1, 0.9)
                } as Vector2
            }
            else {
                console.log("p5 is not ready yet, returning the middle of the canvas");
                return {
                    x: 0.5,
                    y: 0.5
                }
            }
        }
    },
    async mounted() {
        this.filter = this.$route.params.filter as string;
        this.socket = this.setupSocket();

        const images = await getAllImages(this.filter);
        
        console.log(images);

        this.loadedDrawings = [];
        this.socket.on("newimage", (data: Image) => {
            if (this.filter.length > 0 && data.color !== this.filter) return;
            console.log("New image added ", data);
            if (this.p && data.base64) {
                const drawing = this.createDrawing(data.base64, this.getRandomPos());
                this.addDrawing(drawing);
            }
        });

        const sketch = (p: p5) => {
            p.setup = () => {
                this.p = p;
                const renderer = p.createCanvas(480, 480);

                for (let i = 1; i < 5; i++) {
                    this.overlays.push(p.loadImage("/img/DrawOverlay1_" + i + ".png"));
                }
                p.background('black');
                p.frameRate(this.frameRate);

                this.canvas = document.getElementById(renderer.id()) as HTMLCanvasElement;

                this.ctx = this.canvas?.getContext("2d");
                p.resizeCanvas(window.innerWidth, window.innerHeight, true);

                for (let i = 0; i < images.length; i++) {
                    if (this.loadedDrawings.length >= this.maxDrawings) break;

                    const drawing = this.createDrawing(images[i].url, this.getRandomPos());
                    this.addDrawing(drawing);
                }
                console.log("Loaded " + this.loadedDrawings.length + " drawings");
            };

            p.draw = () => {
                this.frameRateFeedback = p.frameRate();
                p.background(0);

                for (let i = 0; i < this.loadedDrawings.length; i++) {
                    const drawing = this.loadedDrawings[i];
                    const size = easeOutCirc(i / this.loadedDrawings.length);
                    console.log("i: " + i + " size: " + size + " input: " + i / this.loadedDrawings.length);

                    this.animateDrawing(drawing, size);
                }
                const n = Math.round(p.random(0, 3));
                
                p.image(this.overlays[n], 0, 0, p.width, p.height);
                
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
            <p>Connection status is '{{ status }}', total drawings {{ loadedDrawings.length }} and fps: {{ frameRateFeedback }}</p>
        </div>

        <div ref="p5container"></div>
    </div>
</template>