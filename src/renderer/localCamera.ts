import { Vec3 } from "../stl/3d/index.js"
import { CameraComponent, ICamera, ICameraComponent } from "./camera.js"

export interface LocalCamera extends ICamera {
    attachToComponent(cam: ICameraComponent): void
    getCameraComponent(): ICameraComponent
    inFrustum(pos: Vec3, useOrtho?: boolean): boolean
    triangleInFrustum(points: Vec3[], useOrtho?: boolean): boolean
}

export class LocalCamera3D implements LocalCamera {
    static readonly defaultCameraComponent: ICameraComponent = new CameraComponent()

    get location() {
        return this.attachedComponent.location
    }

    get direction() {
        return this.attachedComponent.direction
    }

    get fov() {
        return this.attachedComponent.fov
    }

    get near() {
        return this.attachedComponent.near
    }

    get far() {
        return this.attachedComponent.far
    }

    get aspectRatio() {
        return this.attachedComponent.aspectRatio
    }

    private attachedComponent: ICameraComponent = LocalCamera3D.defaultCameraComponent

    rotateUp(angle: number) {
        const rotation = new DOMMatrix().rotateAxisAngle(
            this.direction.right.x,
            this.direction.right.y,
            this.direction.right.z,
            angle
        )
        this.direction.up = Vec3.fromDomPoint(
            rotation.transformPoint(new DOMPoint(this.direction.up.x, this.direction.up.y, this.direction.up.z))
        )
        this.direction.lookAt = Vec3.cross(this.direction.right, this.direction.up)
        this.direction.lookAt.n()
        return this.direction.up
    }

    rotateRight(angle: number) {
        const rotation = new DOMMatrix().rotateAxisAngle(
            this.direction.up.x,
            this.direction.up.y,
            this.direction.up.z,
            angle
        )
        this.direction.right = Vec3.fromDomPoint(
            rotation.transformPoint(new DOMPoint(this.direction.right.x, this.direction.right.y, this.direction.right.z))
        )
        this.direction.lookAt = Vec3.cross(this.direction.right, this.direction.up)
        this.direction.lookAt.n()
        return this.direction.right
    }

    rotateLookAt(angle: number) {
        const rotation = new DOMMatrix().rotateAxisAngle(
            this.direction.up.x,
            this.direction.up.y,
            this.direction.up.z,
            angle
        )
        this.direction.lookAt = Vec3.fromDomPoint(
            rotation.transformPoint(new DOMPoint(this.direction.lookAt.x, this.direction.lookAt.y, this.direction.lookAt.z))
        )
        this.direction.right = Vec3.cross(this.direction.lookAt, this.direction.up)
        this.direction.right.n()
        return this.direction.lookAt
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
        const { up, right, lookAt } = this.direction
        return new DOMMatrix([
            right.x, right.y, right.z, -Vec3.dot(right, this.location),
            up.x, up.y, up.z, -Vec3.dot(up, this.location),
            lookAt.x, lookAt.y, lookAt.z, -Vec3.dot(lookAt, this.location),
            0, 0, 0, 1
        ])
    }

    perspectiveMatrix(): DOMMatrix {
        return new DOMMatrix([
            this.aspectRatio * this.fov, 0, 0, 0,
            0, this.fov, 0, 0,
            0, 0, this.far / (this.far - this.near), -this.near * this.far / (this.far - this.near),
            0, 0, -1, 0
        ])
    }

    orthoMatrix(): DOMMatrix {
        const left = -1 * this.aspectRatio
        const right = 1 * this.aspectRatio
        const top = 1
        const bottom = -1
        return new DOMMatrix([
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (this.far - this.near), -(this.far + this.near) / (this.far - this.near),
            0, 0, 0, 1
        ])
    }

    attachToComponent(cam: ICameraComponent): void {
        this.attachedComponent = cam
    }

    getCameraComponent(): ICameraComponent {
        return this.attachedComponent ?? LocalCamera3D.defaultCameraComponent
    }

    inFrustum(pos: Vec3, useOrtho = false): boolean {
        // 将点转换到相机空间
        const viewPos = this.viewMatrix().transformPoint(new DOMPoint(pos.x, pos.y, pos.z))
        
        // 检查z坐标是否在视锥范围内
        if (viewPos.z < this.near || viewPos.z > this.far) {
            return false
        }

        if (useOrtho) {
            // 正交投影使用固定边界
            const xBound = this.aspectRatio
            const yBound = 1
            return Math.abs(viewPos.x) <= xBound && 
                   Math.abs(viewPos.y) <= yBound
        } else {
            // 透视投影使用基于距离的边界
            const tanFov = Math.tan(this.fov * Math.PI / 360)
            const xBound = tanFov * viewPos.z * this.aspectRatio
            const yBound = tanFov * viewPos.z
            return Math.abs(viewPos.x) <= xBound && 
                   Math.abs(viewPos.y) <= yBound
        }
    }

    triangleInFrustum(points: [Vec3, Vec3, Vec3], useOrtho = false): boolean {
        return points.some(p => this.inFrustum(p, useOrtho))
    }
}
