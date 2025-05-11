import { IDrawable } from '../drawables/index.js'
import { Component } from '../arch/component.js'
import { Level } from '../arch/level.js'

export interface ISprite<T extends IDrawable = IDrawable> {
    readonly drawable: T
    readonly anchor: [ number, number ]
    readonly transform: DOMMatrix
    z: number
    alpha: number
    debug: boolean
}

export class Sprite<T extends IDrawable = IDrawable> extends Component implements ISprite {

    static create<T extends IDrawable = IDrawable>({
        drawable, anchor, transform, z, alpha, debug
    }: Partial<Omit<ISprite, 'drawable'>> & Pick<ISprite, 'drawable'>): Sprite<T> {
        return new Sprite<T>(
            //@ts-ignore
            drawable,
            transform ?? new DOMMatrix(),
            anchor ?? [0.5, 0.5],
            z ?? 0,
            alpha ?? 1,
            debug ?? false
        )
    }

    constructor(
        public drawable: T,
        public transform: DOMMatrix = new DOMMatrix(),
        public anchor: [number, number] = [0.5, 0.5],
        public z = 0,
        public alpha = 1,
        public debug = false,
    ){
        super()
    }

    start(): void {}

    update(_: number, lvl: Level): void {
        lvl.recordRenderInfo(
            this.drawable,
            this.getAncestorComponents(Sprite)
                .flat()
                .reduce((pre, cur) => {
                    return pre.multiply(cur.transform)
                }, this.transform.translate(...this.getAnchoredTranslate())),
            this.z,
            this.alpha,
            this.debug,
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
                let left = p1[0],
                    right = p1[0],
                    top = p1[0],
                    bottom = p1[1]

                points.slice(1).forEach(([ x, y ]) => {
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
    
}