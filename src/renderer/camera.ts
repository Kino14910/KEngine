import { INode, KNode } from "../arch/node.js"
import { ISprite } from "../components/sprite.js"

export class Camera2D extends KNode {
    x: number = 0
    y: number = 0
    z: number = -1
    rotZ: number = 0
    fov = 60
    near = -0.5
    far = 1

    private tw: number
    private th: number

    constructor(
        id: string,
        parent: INode,
        public w: number,
        public h: number,
    ) {
        super(id, parent)
        this.tw = w / 2
        this.th = h / 2
    }

    private bindTo?: ISprite

    lookAt() {
        if (this.bindTo) {
            return this.bindTo.transform.inverse()
        }

        return new DOMMatrix()
            .translateSelf(-this.x, -this.y, -this.z)
            .rotateAxisAngleSelf(0, 0, 1, -this.rotZ)
    }

    bindCameraTo(sprite: ISprite) {
        this.bindTo = sprite
    }

    originToCenter() {
        return new DOMMatrix()
            .translateSelf(this.tw, this.th)
    }
}