import { Level } from "../arch/level.js"
import { Vec3 } from "../stl/3d/index.js"
import { CameraComponent, CameraDirection, ICamera, ICameraComponent } from "./camera.js"

export interface LocalCamera extends ICamera {
    attachToComponent(cam: ICameraComponent): void
    getCameraComponent(): ICameraComponent
    renderLevel(level: Level): void
}

export class LocalCamera3D implements LocalCamera {
    static readonly defaultCameraComponent: ICameraComponent = new CameraComponent()

    constructor(
        public location: Vec3 = Vec3.from(0, 0, 0),
        public direction: CameraDirection = {
            up: Vec3.from(0, 1, 0),
            right: Vec3.from(1, 0, 0),
            lookAt: Vec3.from(0, 0, -1),
        },
        public fov: number = 90,
        public near: number = -0.5,
        public far: number = 100,
    ) {
        this.attachToComponent(LocalCamera3D.defaultCameraComponent)
    }

    private attachedComponent?: ICameraComponent

    rotateUp(angle: number) {
        this.direction.up
    }

    rotateRight(angle: number) {
        
    }

    rotateLookAt(angle: number) {
        
    }

    lookAt(pos: Vec3, up: Vec3) {
        const look = Vec3.sub(pos, this.location)
        look.n()
        this.direction.lookAt = look

        const right = Vec3.cross(up, look)
        right.n()
        this.direction.right = right

        const newUp = Vec3.cross(look, right)
        newUp.n()
        this.direction.up = newUp
    }

    viewMatrix(): DOMMatrix {
        const {  up, right, lookAt } = this.direction
        return new DOMMatrix([
            right.x, right.y, right.z, -Vec3.dot(right, this.location),
            up.x, up.y, up.z, -Vec3.dot(up, this.location),
            lookAt.x, lookAt.y, lookAt.z, -Vec3.dot(lookAt, this.location),
            0, 0, 0, 1
        ])
    }

    attachToComponent(cam: ICameraComponent): void {
        this.attachedComponent = cam
    }

    getCameraComponent(): ICameraComponent {
        return this.attachedComponent ?? LocalCamera3D.defaultCameraComponent
    }

    renderLevel(level: Level): void {
        
    }
}