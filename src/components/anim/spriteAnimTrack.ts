import { IImage } from "../../drawables/image.js"
import { Sprite } from "../sprite.js"
import { AnimationTrack } from "./animTrack.js"

export interface ISpriteSheet {
    spriteResource: IImage
    width: number
    height: number
    originX: number
    originY: number
    rows: number
    columns: number
    count: number
}

export interface SpriteSheetAnimationData {
    x: number
    y: number
    width: number
    height: number
}

export class SpriteSheetAnimationTrack extends AnimationTrack {
    private _spriteAnimData: SpriteSheetAnimationData[] = []

    constructor(
        readonly spriteSheet: ISpriteSheet,
    ) {
        super('SpriteSheetAnimationTrack')
        const {
            width,
            height,
            originX,
            originY,
            rows,
            columns,
            count
        } = spriteSheet

        const itemWidth = Math.floor(width / columns)
        const itemHeight = Math.floor(height / rows)

        for (let i = 0; i < count; i++) {
            const x = (i % columns) * itemWidth
            const y = Math.floor(i / columns) * itemHeight
            this._spriteAnimData.push({
                x: originX + x,
                y: originY + y,
                width: itemWidth,
                height: itemHeight
            })
        }
    }

    private sprite?: Sprite

    start(): void {
        this.sprite = this
            .getAnimation()
            .getController()
            .getComponent(Sprite)

        if (!this.sprite) {
            throw new Error('SpriteSheetAnimationTrack requires a Sprite component')
        }

        const timeChunk = this.getAnimation().duration / this._spriteAnimData.length
        let i = 0
        for (const animData of this._spriteAnimData) {
            this.addNotify(timeChunk * i++, `frame${i}`, () => {
                this.renderFrame(animData)
            })
        }

        this.sprite.drawable = this.spriteSheet.spriteResource
    }

    end(): void {}

    renderFrame({ x, y, width, height }: SpriteSheetAnimationData): void {
        if (!this.sprite) {
            return
        }

        const res = this.spriteSheet.spriteResource
        res.sx = x
        res.sy = y
        res.sw = width
        res.sh = height

        console.log('tried')
    }
    
    
}