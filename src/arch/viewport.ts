import { LocalCamera, LocalCamera3D } from "../renderer/localCamera.js"

export interface IViewport {
    readonly camera: LocalCamera
    
    /** 视口位置和尺寸 (相对于窗口) */
    rect: {
        x: number
        y: number 
        width: number
        height: number
    }
}

export class Viewport implements IViewport {
    constructor(
        readonly camera: LocalCamera = new LocalCamera3D(),
        readonly rect: {
            x: number
            y: number 
            width: number
            height: number
        } = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        },
    ) {}
}