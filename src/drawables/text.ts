import { Vec2, Vector2 } from "../stl/vec2.js"
export interface IText {
    readonly type: 'text'
    content: string
    position: Vector2
    fontSize: number
    maxWidth: number
    fillStyle: string
    strokeStyle: string
}

export class DefaultTextDrawable implements IText {
    readonly type = "text"
    constructor(
        public position: Vector2 = Vec2.from(50, 90),
        public content: string = 'Hello world',
        public fontSize: number = 24,
        public maxWidth: number = 100,
        public fillStyle: string = 'black',
        public strokeStyle: string = 'black',
    ){}
}
