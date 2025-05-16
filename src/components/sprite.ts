import { IDrawable2D } from '../drawables/index.js'
import { Component } from '../arch/component.js'
import { getCurrentApplication } from '../arch/reflect.js'

export interface ISprite<T = IDrawable2D> {
    readonly drawable: T
    readonly anchor: [ number, number ]
    readonly transform: DOMMatrix
    z: number
    alpha: number
    debug: boolean
    display: boolean
}

export class Sprite extends Component implements ISprite {

    static create({
        drawable, anchor, transform, z, alpha, debug, display
    }: Partial<Omit<ISprite, 'drawable'>> & Pick<ISprite, 'drawable'>): Sprite {
        return new Sprite(
            drawable,
            transform,
            anchor,
            z,
            alpha,
            debug,
            display
        )
    }

    constructor(
        public drawable: IDrawable2D,
        public transform: DOMMatrix = new DOMMatrix(),
        public anchor: [number, number] = [0.5, 0.5],
        public z = 0,
        public alpha = 1,
        public debug = false,
        public display = true,
    ){
        super()
    }

    start(): void {}

    getWorldTransform() {
        return this.getAncestorComponents(Sprite)
            .flat()
            .reduce(
                (pre, cur) => pre.multiply(cur.transform),
                this.transform.translate(...this.getAnchoredTranslate())
            )
    }

    getAnchoredTranslate() {
        const [ ax, ay ] = this.anchor
        switch (this.drawable.type) {
            case 'image': {
                const { w, h } = this.drawable
                return [
                    -w * ax,
                    -h * ay
                ]
            }

            case 'shape': {
                const { points } = this.drawable
                const p1 = points[0]
                let left = p1.x,
                    right = p1.x,
                    top = p1.y,
                    bottom = p1.y

                points.slice(1).forEach(({ x, y }) => {
                    if (x < left) {
                        left = x
                    }

                    if (x > right) {
                        right = x
                    }

                    if (y < top) {
                        top = y
                    }

                    if (y > bottom) {
                        bottom = y
                    }
                })

                const w = left - right
                const h = top - bottom

                return [
                    w * ax,
                    h * ay
                ]
            }

            case 'text': {
                return [0, 0]
            }
        }
    }

    update(): void {
        getCurrentApplication().getRenderer().submit({
            drawable: this.drawable,
            transfrom: this.getWorldTransform(),
            z: this.z,
        })
    }
    
}