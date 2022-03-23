import type { Image } from "p5";
import type { Vector2 } from "./vector2";

export class Drawing {
    startPos: Vector2 = { x: 0, y: 0 };
    currentPos: Vector2 = { x: 0, y: 0 };
    image: Image | null = null
}