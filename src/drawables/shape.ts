import { Point } from "./Point.js"
export interface IShape {
    readonly type: 'shape'
    points: Point[]
    fillStyle: string
    strokeStyle: string
}


export class DefaultDrawable implements IShape {
    readonly type = "shape"
    constructor(
        public points: Point[] = [],
        public fillStyle: string = 'red',
        public strokeStyle: string = 'black',
    ){}
}

