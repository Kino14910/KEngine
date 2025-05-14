import { Matrix, Vec3 } from "../stl/3d/index.js"

export interface LocalCameraDirection {
    up: Vec3
    right: Vec3
    lookAt: Vec3
}

export class LocalCamera {
    location: Vec3 = Vec3.from(0, 0, 0)
    direction: LocalCameraDirection = {
        up: Vec3.from(0, 1, 0),
        right: Vec3.from(1, 0, 0),
        lookAt: Vec3.from(0, 0, -1),
    }
    fov: number = 90
    near: number = 0.1
    far: number = 1000

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
}