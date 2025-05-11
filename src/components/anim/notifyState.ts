import { IAnimationTrack } from "./animTrack.js"

export interface INotifyState {
    offset: number
    duration: number
    name: string
    notify?(): void
    notifyEnd?(): void
    update?(dt: number, time: number): void
    getAnimationTrack(): IAnimationTrack
}

export class NotifyState implements INotifyState {
    constructor(
        private animationTrack: IAnimationTrack,
        public name: string,
        public offset: number = 0,
        public duration: number = 0,
        public notify?: () => void,
        public notifyEnd?: () => void,
        public update?: (dt: number, time: number) => void,
    ) {}

    getAnimationTrack(): IAnimationTrack {
        return this.animationTrack
    }
}