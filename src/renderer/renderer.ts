
import { getCurrentApplication } from "../arch/reflect.js"
import { IDrawable2D } from "../drawables/index.js"
import { DrawReceiver } from "./drawCommand.js"
import { Painter } from "./painter.js"

export interface IRenderer<Ctx, DrawCall> {
    setContext(context: Ctx): void
    submit(call: DrawCall): void
}

export type Scheduler = (exec: () => void) => void

export interface Renderer2DContext {
    ctx: CanvasRenderingContext2D
    pixelArt: boolean
}

export interface DrawCall2D {
    drawable: IDrawable2D
    transfrom: DOMMatrix
    z: number
}

export class Renderer2D implements IRenderer<Renderer2DContext, DrawCall2D> {
    private ctx?: CanvasRenderingContext2D
    // private readonly drawReceiver = new DrawReceiver()
    private readonly painter = new Painter()
    private readonly drawCalls: DrawCall2D[] = []

    constructor (
        canvas: HTMLCanvasElement,
        private scheduler: Scheduler,
        public pixelArt: boolean = false,
    ){
        this.setContext({
            ctx: canvas.getContext('2d')!,
            pixelArt
        })
        this.scheduler(() => {
            this.sort()
            this.render()
            this.drawCalls.length = 0
        })
    }

    private sort() {
        this.drawCalls.sort((a, b) => {
            return a.z - b.z
        })
    }

    private render() {
        this.drawCalls.forEach(({ drawable, transfrom }) => {
            if (this.ctx) {
                this.painter.draw(this.ctx, drawable, transfrom)
            }
        })
    }

    setContext(context: Renderer2DContext): void {
        this.ctx = context.ctx
        this.pixelArt = context.pixelArt
        if (this.pixelArt) {
            this.ctx.imageSmoothingEnabled = false
        } else {
            this.ctx.imageSmoothingEnabled = true
        }
    }

    submit({ drawable, transfrom, z }: DrawCall2D): void {
        const size = getCurrentApplication().getWindowSize()
        this.drawCalls.push({
            drawable,
            transfrom: transfrom.translateSelf(size?.x / 2, size?.y / 2),
            z
        })
    }

}
