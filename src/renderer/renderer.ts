
import { DrawCmdFactory, IDrawReceiver } from "./drawCommand.js";

export interface IRenderer {
    render(cmdFactory: DrawCmdFactory): void
}

/**
 * execute 是 scheduler 进行一次渲染的调度函数,
 * 每次执行 execute 就进行一次渲染
 */
export type RenderScheduler = (execute: () => void) => void

export class Renderer implements IRenderer {
    static instance: Renderer | null

    private ctx : CanvasRenderingContext2D

    constructor (
        canvas: HTMLCanvasElement,
        private receiver: IDrawReceiver,
        private scheduler: RenderScheduler,
        public pixelArt: boolean = false,
    ){
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        if (pixelArt) {
            this.ctx.imageSmoothingEnabled = false
        } else {
            this.ctx.imageSmoothingEnabled = true
        }

        this.init()
        Renderer.instance = this
    }

    private init() {
        this.scheduler(() => this.receiver.execute())
    }

    render(cmdFactory: DrawCmdFactory): void {
        this.receiver.receive(cmdFactory(this.ctx))
    }

}
