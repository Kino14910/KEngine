import { LinkedList } from "../stl/linkedList.js"

export interface DrawCommand {
    (): void
}

export interface DrawCmdFactory<Ctx> {
    (ctx: Ctx): DrawCommand
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
            this.cmds.remove(cmd)
        }
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
