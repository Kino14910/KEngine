import { Component, IComponent } from "../../arch/component.js"
import { Option } from "../../arch/match.js"
import { IAnimationTrack } from "./animTrack.js"

export interface Frame2D {
    sx: number
    sy: number
    sw: number
    sh: number
}

export interface IAnimation {
    duration: number
    loop: boolean
    dilation: number
    playbackTime: number
    addTrack(track: IAnimationTrack): IAnimation
    removeTrack(id: string): void
    getTrack(id: string): Option<IAnimationTrack>
    getTracks(): MapIterator<[string, IAnimationTrack]>
    play(): void
    pause(): void
    stop(): void
    isPlaying(): boolean
}

export class Animation implements IAnimation {
    private tracks: Map<string, IAnimationTrack> = new Map()

    constructor(
        public duration: number,
        public loop: boolean = true,
        public dilation: number = 1,
        public playbackTime: number = 0,
    ) {}

    private _lastUpdateTime: number = 0
    private _isPlaying: boolean = false

    isPlaying(): boolean {
        return this._isPlaying
    }

    play() {
        this._isPlaying = true
        this._lastUpdateTime = Date.now()
    }

    pause() {
        this._isPlaying = false
    }

    stop() {
        this._isPlaying = false
        this.playbackTime = 0
    }

    addTrack(track: IAnimationTrack): IAnimation {
        this.tracks.set(track.id, track)
        return this
    }

    removeTrack(id: string): void {
        this.tracks.delete(id)
    }

    getTrack(id: string): Option<IAnimationTrack> {
        return Option.Some(this.tracks.get(id))
    }

    getTracks(): MapIterator<[string, IAnimationTrack]> {
        return this.tracks.entries()
    }

    start(): void {}

    private updatePlaybackTime() {
        if (this._isPlaying) {
            this.playbackTime += (Date.now() - this._lastUpdateTime) * this.dilation
            this._lastUpdateTime = Date.now()
        }
        if (this.playbackTime >= this.duration) {
            if (this.loop) {
                this.playbackTime = this.playbackTime % this.duration
            } else {
                this.playbackTime = this.duration
                this._isPlaying = false
            }
        }

        return this.playbackTime
    }

    update(dt: number): void {
        this.tracks.forEach(track =>
            track.handleTrackUpdate(dt, this.updatePlaybackTime())
        )
    }
}


// export abstract class Animation2D implements IAnimation {
//     constructor(
//         public image: IImage,
//         public frames: { [k: number]: Frame2D },
//         public duration: number,
//         public loop: boolean = true
//     ) {}
    
//     static fromUV(
//         image: IImage,
//         duration: number,
//         loop: boolean,
//         w: number,
//         h: number,
//         u: number,
//         v: number,
//         ew: number,
//         eh: number,
//         count: number,
//     ): Animation2D {
//         const frames: { [k: number]: Frame2D } = {}
//         const durationPerFrame = duration / count
//         //纵向精灵图
//         if(w === ew) 
//             [w, h, u, v, ew, eh] = [h, w, v, u, eh, ew]
//         //横向精灵图
//         let countPerLine = Math.floor(w / ew)
//         let lineCount = Math.ceil(count / countPerLine)
//         for (let line = 0; line < lineCount; line++) {
//             for (let i = 0; i < countPerLine; i++) {
//                 const index = line * countPerLine + i
//                 if (index >= count) break
//                 frames[index * durationPerFrame] = {
//                     sx: u + ew * i,
//                     sy: v + eh * line,
//                     sw: ew,
//                     sh: eh,
//                 }
//             }
//             // console.table(frames)
//         }
//         return new ConcreteAnimation2D(image, frames, duration, loop)
//     }

//     abstract update(): number

//     getFrame(t: number): Frame2D {
//         let lastKeyframeTime = 0
//         const orderedKeys = Object.keys(this.frames).map(Number).sort((a, b) => a - b)
//         for (const _time of orderedKeys) {
//             const frame = this.frames[_time]
//             const time = Number(_time)

//             if (t === time) {
//                 return frame
//             }

//             if (lastKeyframeTime === 0) {
//                 lastKeyframeTime = time
//                 continue
//             }

//             if (t > lastKeyframeTime && t <= time) {
//                 return frame
//             }

//             lastKeyframeTime = time
//         }

//         return this.frames[orderedKeys.at(-1)!]
//     }
// }

// class ConcreteAnimation2D extends Animation {

//     private lastTime = 0
//     private timer = 0
//     update(): number {
//         if (this.lastTime === 0) {
//             this.lastTime = performance.now()
//             return 0
//         }

//         const now = performance.now()
//         const deltaTime = now - this.lastTime
//         this.lastTime = now
//         this.timer += deltaTime
//         return this.loop
//             ? this.timer % this.duration
//             : this.timer
//     }

//     constructor(
//         public image: IImage,
//         public frames: { [k: number]: Frame2D },
//         public duration: number,
//         public loop: boolean = true,
//     ) {
//         super(image, frames, duration, loop)
//     }
// }

// export abstract class AnimationController extends Component {

//     abstract state(str: string): string

//     private _playingAnim?: IAnimation
//     play(anim: IAnimation): void {
//         this._playingAnim = anim
//     }

//     stop() {
//         this._playingAnim = undefined
//     }

//     playing(): IAnimation | undefined {
//         return this._playingAnim
//     }

//     start(): void {}
//     update(): void {
//         if (!this._playingAnim) {
//             return
//         }

//         const time = this._playingAnim.update()
//         if (time > this._playingAnim.duration) {
//             this._playingAnim = undefined
//             return
//         }

//         const frame = this._playingAnim.getFrame(time)
//         this.drawFrame(frame)
//     }

//     private _state: string = ''
//     setState(state: string) {
//         if (state === this._state) {
//             return
//         }

//         this._state = this.state(state)
//     }

//     getState(): string {
//         return this._state
//     }
// }

// export abstract class Animation2DController extends AnimationController {
//     drawFrame({ sh, sw, sx, sy }: Frame2D): void {
//         ifLet(Option.Some(this.getComponent(Sprite)), 'Some', sprite =>
//             {
//                 const playingAnim = this.playing() as ConcreteAnimation2D
//                 if (!playingAnim) {
//                     return
//                 }
        
//                 const image = playingAnim.image
//                 if (image) {
//                     image.sh = sh
//                     image.sw = sw
//                     image.sx = sx
//                     image.sy = sy
//                 }

//                 if (sprite.drawable !== image) {
//                     sprite.drawable = image
//                 }
//             }
//         )
//     }
// }