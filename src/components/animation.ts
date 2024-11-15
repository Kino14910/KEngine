import { Component } from "../arch/component.js"
import { Level } from "../arch/level.js"

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
    getFrame(time: number): Frame
}

export abstract class Animation2D implements IAnimation<Frame2D> {
    constructor(
        public frames: { [k: number]: Frame2D },
        public duration: number
    ) {}
    
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
            // console.table(frames)
        }
        return new ConcreteAnimation2D(frames, duration)
    }

    abstract update(): number

    getFrame(t: number): Frame2D {
        let lastKeyframeTime = 0
        const orderedKeys = Object.keys(this.frames).map(k => +k).sort((a, b) => a - b)
        for (const time of orderedKeys) {
            const frame = this.frames[time]

            if (lastKeyframeTime === +time) {
                return frame
            }

            if (lastKeyframeTime === 0) {
                lastKeyframeTime = +time
                continue
            }

            if (t > +lastKeyframeTime && t <= +time) {
                return frame
            }

            lastKeyframeTime = +time
        }

        return this.frames[orderedKeys.at(-1)!]
    }
}

class ConcreteAnimation2D extends Animation2D {

    update(): number {
        const now = performance.now() % this.duration
        let animTime = 0

        Object.keys(this.frames).forEach((time, i, arr) => {
            if (now > +time && now <= +arr[i + 1]) {
                animTime = +time
            }
        })

        return animTime
    }

    constructor(
        public frames: { [k: number]: Frame2D },
        public duration: number
    ) {
        super(frames, duration);
    }
}

export abstract class AnimationController extends Component {

    abstract state(str: string): void

    private _playingAnim?: IAnimation<any>
    play<F>(anim: IAnimation<F>): void {
        this._playingAnim = anim
    }

    start(): void {}
    update(): void {
        if (!this._playingAnim) {
            return
        }

        this._playingAnim.update()
    }

    setState(state: string) {
        this.state(state)
    }
}