import { Component } from "../arch/component.js"
import { Sprite } from "./sprite.js"

export interface Frame2D {
    sx: number
    sy: number
    sw: number
    sh: number
}

export interface IAnimation<Frame> {
    sprite: Sprite,
    frames: { [k: number]: Frame }
    duration: number
    loop: boolean
    update(): number
    getFrame(time: number): Frame
}

export abstract class Animation2D implements IAnimation<Frame2D> {
    constructor(
        public sprite: Sprite,
        public frames: { [k: number]: Frame2D },
        public duration: number,
        public loop: boolean = true
    ) {}
    
    static fromUV(
        sprite: Sprite,
        duration: number,
        loop: boolean,
        w: number,
        h: number,
        u: number,
        v: number,
        ew: number,
        eh: number,
        count: number,
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
        return new ConcreteAnimation2D(sprite, frames, duration, loop)
    }

    abstract update(): number

    getFrame(t: number): Frame2D {
        let lastKeyframeTime = 0
        const orderedKeys = Object.keys(this.frames).map(k => +k).sort((a, b) => a - b)
        for (const time of orderedKeys) {
            const frame = this.frames[time]

            if (t === +time) {
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

    private lastTime = 0
    private timer = 0
    update(): number {
        if (this.lastTime === 0) {
            this.lastTime = performance.now()
            return 0
        }

        const now = performance.now()
        const deltaTime = now - this.lastTime
        this.lastTime = now
        this.timer += deltaTime
        return this.loop
            ? this.timer % this.duration
            : this.timer
    }

    constructor(
        public sprite: Sprite,
        public frames: { [k: number]: Frame2D },
        public duration: number,
        public loop: boolean = true,
    ) {
        super(sprite, frames, duration, loop)
    }
}

export abstract class AnimationController<F> extends Component {

    abstract state(str: string): string
    abstract drawFrame(frame: any): void

    private _playingAnim?: IAnimation<F>
    play(anim: IAnimation<F>): void {
        this._playingAnim = anim
    }

    stop() {
        this._playingAnim = undefined
    }

    playingAnim(): IAnimation<F> | undefined {
        return this._playingAnim
    }

    start(): void {}
    update(): void {
        if (!this._playingAnim) {
            return
        }

        const time = this._playingAnim.update()
        if (time > this._playingAnim.duration) {
            this._playingAnim = undefined
            return
        }

        const frame = this._playingAnim.getFrame(time)
        this.drawFrame(frame)
    }

    private _state: string = ''
    setState(state: string) {
        if (state === this._state) {
            return
        }

        this._state = this.state(state)
    }

    getState(): string {
        return this._state
    }
}