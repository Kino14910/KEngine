import { LinkedList } from "../stl/linkedList.js"

export interface DrawCommand {
    (): void
}

export interface DrawCmdFactory {
    (ctx: CanvasRenderingContext2D): DrawCommand
}

export interface IDrawReceiver {
    execute(): void
    receive(cmd: DrawCommand): void
}

export class DrawReceiver implements IDrawReceiver {
    private cmds = new LinkedList<DrawCommand>()
    execute(): void {
        for (const cmd of this.cmds) {
            cmd()
        }
        this.cmds.clear()
    }
    receive(cmd: DrawCommand): void {
        this.cmds.append(cmd)
    }
    
}

export interface ClearConf {
    x: number
    y: number
    w: number
    h: number
}

export const clearCommand: (conf: Omit<ClearConf, 'type'>) => DrawCmdFactory = ({ x, y, w, h } = {
    x: 0, y: 0, w: 0, h: 0
}) => {
    return ctx =>
        () => {
            ctx.save()
            ctx.clearRect(
                x,
                y,
                w,
                h
            )
            ctx.beginPath()
            ctx.restore()
        }
}
