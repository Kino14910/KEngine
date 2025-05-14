import { Component, IComponent } from "../arch/component.js"
import { Level } from "../arch/level.js"
import { INode, KNode } from "../arch/node.js"
import { ISprite } from "../components/sprite.js"

export interface ICamera extends IComponent {
    location: [number, number, number]
    rotation: [number, number, number]
    fov: number
    near: number
    far: number
}

export class Camera2D extends Component implements ICamera {
    location: [number, number, number] = [0, 0, 0]
    rotation: [number, number, number] = [0, 0, 0]
    fov: number = 90
    near: number = -0.5
    far: number = 1

    tick?(dt: number, lvl: Level): void {
        throw new Error("Method not implemented.")
    }

    destroy?(): void {
        throw new Error("Method not implemented.")
    }

}

// export class Camera2D extends KNode {
//     x: number = 0
//     y: number = 0
//     z: number = -1
//     rotZ: number = 0
//     fov = 60
//     near = -0.5
//     far = 1

//     private tw: number
//     private th: number

//     constructor(
//         id: string,
//         parent: INode,
//         public w: number,
//         public h: number,
//     ) {
//         super(id, parent)
//         this.tw = w / 2
//         this.th = h / 2
//     }

//     private bindTo?: ISprite

//     lookAt() {
//         if (this.bindTo) {
//             return this.bindTo.transform.inverse()
//         }

//         return new DOMMatrix()
//             .translateSelf(-this.x, -this.y, -this.z)
//             .rotateAxisAngleSelf(0, 0, 1, -this.rotZ)
//     }

//     bindCameraTo(sprite: ISprite) {
//         this.bindTo = sprite
//     }

//     originToCenter() {
//         return new DOMMatrix()
//             .translateSelf(this.tw, this.th)
//     }
// }