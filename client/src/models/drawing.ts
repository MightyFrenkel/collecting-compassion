import type { Image } from "p5";
import type { Vector2 } from "./vector2";

export class Drawing {

    constructor(start: Vector2, image: Image) {
        this.startPos = start;
        this.currentPos = this.startPos;
        this.targetPos = this.startPos;
        this.image = image;
    }
    readonly startPos: Vector2 = { x: 0, y: 0 };
    currentPos: Vector2 = { x: 0, y: 0 };
    targetPos: Vector2 = { x:0, y:0}
    image: Image | null = null

    public distance() {
        return Math.sqrt(Math.pow(this.targetPos.x - this.currentPos.x, 2) + Math.pow(this.targetPos.y - this.currentPos.y, 2));
    }

    public difference() {
        return {
            x: (this.targetPos.x - this.currentPos.x),
            y: (this.targetPos.y - this.currentPos.y)
        }
    }

    public normDirection() {
        const diff = this.difference();
        const length = this.distance();
        return {
            x: diff.x / length,
            y: diff.y / length
        } as Vector2
    }


}