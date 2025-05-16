import { Component, ConstructorOf, IComponent } from "../arch/component.js"
import { Vec3 } from "../stl/3d/index.js"

export interface CameraDirection {
    up: Vec3
    right: Vec3
    lookAt: Vec3
}

export interface ICamera {
    location: Vec3
    direction: CameraDirection
    fov: number
    near: number
    far: number
    aspectRatio: number
}

export interface ICameraComponent extends ICamera, IComponent {}

export class CameraComponent extends Component implements ICamera {
    static readonly globalCameras = new Map<string, CameraComponent>()

    constructor(
        public location: Vec3 = Vec3.from(0, 0, 0),
        public direction: CameraDirection = {
            up: Vec3.from(0, 1, 0),
            right: Vec3.from(1, 0, 0),
            lookAt: Vec3.from(0, 0, -1),
        },
        public fov: number = 90,
        public near: number = -0.5,
        public far: number = 1,
        public aspectRatio: number = 16 / 9
    ) {
        super()
    }

    static registerCamera(name: string, cam: CameraComponent) {
        CameraComponent.globalCameras.set(name, cam)
    }

    static getCamera(name: string) {
        return CameraComponent.globalCameras.get(name)
    }

    static unregisterCamera(name: string) {
        CameraComponent.globalCameras.delete(name)
    }

    static createCameraComponent(name: string, camClass: ConstructorOf<CameraComponent> = CameraComponent) {
        const cam = Reflect.construct(camClass, [])
        CameraComponent.registerCamera(name, cam)
        return cam
    }
}