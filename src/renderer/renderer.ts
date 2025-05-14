
import { DrawCmdFactory, IDrawReceiver } from "./drawCommand.js";

export interface IRenderer {
    render(cmdFactory: DrawCmdFactory): void
}

export type Scheduler = (exec: () => void) => void

export class Renderer2D implements IRenderer {
    private ctx : CanvasRenderingContext2D

    constructor (
        canvas: HTMLCanvasElement,
        private receiver: IDrawReceiver,
        private scheduler: Scheduler,
        public pixelArt: boolean = false,
    ){
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        if (pixelArt) {
            this.ctx.imageSmoothingEnabled = false
        } else {
            this.ctx.imageSmoothingEnabled = true
        }

        this.init()
    }

    private init() {
        this.scheduler(() => this.receiver.execute())
    }

    render(cmdFactory: DrawCmdFactory): void {
        this.receiver.receive(cmdFactory(this.ctx))
    }

}
