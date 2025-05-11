import { Option } from "../../arch/match.js"
import { IAnimation } from "./animation.js"
import { INotifyState } from "./notifyState.js"

export interface IAnimationTrack {
    id: string
    attachTo(anim: IAnimation): void
    addNotify(time: number, notifyName: string, notify: (track: IAnimationTrack) => void): void
    removeNotify(notifyName: string): void
    getNotify(notifyName: string): Option<IAnimationNotify>
    getNotifies(): MapIterator<[string, IAnimationNotify]>
    addNotifyState(state: INotifyState): void
    removeNotifyState(state: INotifyState): void
    getNotifyStates(): MapIterator<[string, INotifyState]>
    findNotifyState(notifyName: string): Option<INotifyState>
    handleTrackUpdate(dt: number, time: number): void
    getAnimation(): IAnimation
    update?(dt: number, time: number): void
}

export interface IAnimationNotify {
    name: string
    time: number
    notify: (track: IAnimationTrack) => void
    getAnimationTrack(): IAnimationTrack
}

class AnimationNotify implements IAnimationNotify {
    constructor(
        readonly name: string,
        readonly time: number,
        readonly notify: (track: IAnimationTrack) => void,
        readonly animationTrack: IAnimationTrack
    ) {}

    getAnimationTrack(): IAnimationTrack {
        return this.animationTrack
    }
}

export class AnimationTrack implements IAnimationTrack {
    constructor(
        readonly id: string,
        private animation?: IAnimation
    ) {}

    private readonly notifies = new Map<string, IAnimationNotify>()
    private readonly notifyStates = new Map<string, INotifyState>()

    getAnimation(): IAnimation {
        if (this.animation) {
            return this.animation
        }

        throw new Error("AnimationTrack is not attached to an animation")
    }

    attachTo(anim: IAnimation): void {
        this.animation = anim
    }

    addNotify(time: number, notifyName: string, notify: (track: IAnimationTrack) => void): void {
        this.notifies.set(notifyName, new AnimationNotify(notifyName, time, notify, this))
    }

    removeNotify(notifyName: string): void {
        this.notifies.delete(notifyName)
    }

    getNotify(notifyName: string): Option<IAnimationNotify> {
        return Option.Some(this.notifies.get(notifyName))
    }

    getNotifies(): MapIterator<[string, IAnimationNotify]> {
        return this.notifies.entries()
    }

    addNotifyState(state: INotifyState): void {
        this.notifyStates.set(state.name, state)
    }

    removeNotifyState(state: INotifyState): void {
        this.notifyStates.delete(state.name)
    }

    getNotifyStates(): MapIterator<[string, INotifyState]> {
        return this.notifyStates.entries()
    }

    findNotifyState(notifyName: string): Option<INotifyState> {
        return Option.Some(this.notifyStates.get(notifyName))
    }

    handleTrackUpdate(dt: number, time: number): void {
        this._handleNotifies(dt, time)
        this._handleNotifyStates(dt, time)
        this?.update?.(dt, time)
    }

    update(dt: number, time: number) {}

    private _betweenTick(target: number, current: number, dt: number) {
        return current > target && current - target <= dt
    }

    private _handleNotifies(dt: number, time: number) {
        for (const [_, { time: t, notify }] of this.notifies) {
            if (this._betweenTick(t, time, dt)) {
                notify(this)
            }
        }
    }

    private _handleNotifyStates(dt: number, time: number) {
        for (const [_, { notify, notifyEnd, update, offset, duration }] of this.notifyStates) {
            const end = offset + duration
            if (time < offset || time > end) {
                continue
            }
            
            if (this._betweenTick(offset, time, dt)) {
                notify?.()
                continue
            }

            if (time < end) {
                update?.(dt, time - offset)
                continue
            }

            notifyEnd?.()
        }
    }
    
}