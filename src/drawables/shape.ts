import { Vector2 } from "../stl/vec2.js"
export interface IShape {
    readonly type: 'shape'
    points: Vector2[]
    fillStyle: string
    strokeStyle: string
}


export class DefaultDrawable implements IShape {
    readonly type = "shape"
    constructor(
        public points: Vector2[] = [],
        public fillStyle: string = 'red',
        public strokeStyle: string = 'black',
    ){}
}

