import { IDrawable } from "../drawables/index"

export interface Frame2D {
    sx: number
    sy: number
    sw: number
    sh: number
}

export interface IAnimation<Frame> {
    frames: { [k: number]: Frame }
    duration: number
    update(): number
}

export abstract class Animation2D implements IAnimation<Frame2D> {
    constructor(
        public frames: { [k: number]: Frame2D },
        public duration: number
    ) {}
    abstract update(): number
    
    static fromUV(
        w: number,
        h: number,
        u: number,
        v: number,
        ew: number,
        eh: number,
        count: number,
        duration: number
    ): Animation2D {
        const frames: { [k: number]: Frame2D } = {}
        const durationPerFrame = duration / count
        //纵向精灵图
        if(w === ew) 
            [w, h, u, v, ew, eh] = [h, w, v, u, eh, ew]
        //横向精灵图
        let countPerLine = Math.floor(w / ew)
        let lineCount = Math.ceil(count / countPerLine)
        for (let line = 0; line < lineCount; line++) {
            for (let i = 0; i < countPerLine; i++) {
                const index = line * countPerLine + i
                if (index >= count) break
                frames[index * durationPerFrame] = {
                    sx: u + ew * i,
                    sy: v + eh * line,
                    sw: ew,
                    sh: eh,
                }
            }
            console.table(frames)
        }
        return new ConcreteAnimation2D(frames, duration)
    }
}

class ConcreteAnimation2D extends Animation2D {
    // 还没实现
    update(): number {
        return 1
    }
    constructor(
        public frames: { [k: number]: Frame2D },
        public duration: number
    ) {
        super(frames, duration);
    }
}
