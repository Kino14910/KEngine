import { Point } from "./Point.js"
export interface IText {
    readonly type: 'text'
    content: string
    position: Point
    fontSize: number
    maxWidth: number
    fillStyle: string
    strokeStyle: string
}

export class DefaultTextDrawable implements IText {
    readonly type = "text"
    constructor(
        public position: Point = [50, 90],
        public content: string = 'Hello world',
        public fontSize: number = 24,
        public maxWidth: number = 100,
        public fillStyle: string = 'black',
        public strokeStyle: string = 'black',
    ){}
}
