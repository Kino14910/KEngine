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
        count: number
    ): { [k: number]: Frame2D } {
        const frames: { [k: number]: Frame2D } = {}
        //纵向精灵图
        if(w === ew) 
            [w, h, u, v, ew, eh] = [h, w, v, u, eh, ew]
        //横向精灵图
        let lineCount = Math.floor(w / ew)
        while(count >= lineCount) {
            console.log(count)
            for (let i = 0; i < lineCount; i++) {
                console.log(i)
                frames[i] = {
                    sx: u + ew * i,
                    sy: v,
                    sw: ew - 2 * u,
                    sh: eh - 2 * v,
                }
            }
            
            lineCount *= 2
            h += eh
            console.table(frames)
        }
        return frames
    }
}