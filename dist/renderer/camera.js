import { KNode } from "../arch/node.js";
export class Camera2D extends KNode {
    w;
    h;
    x = 0;
    y = 0;
    z = -1;
    rotZ = 0;
    fov = 60;
    near = -0.5;
    far = 1;
    tw;
    th;
    constructor(id, parent, w, h) {
        super(id, parent);
        this.w = w;
        this.h = h;
        this.tw = w / 2;
        this.th = h / 2;
    }
    bindTo;
    lookAt() {
        if (this.bindTo) {
            return this.bindTo.transform.inverse();
        }
        return new DOMMatrix()
            .translateSelf(-this.x, -this.y, -this.z)
            .rotateAxisAngleSelf(0, 0, 1, -this.rotZ);
    }
    bindCameraTo(sprite) {
        this.bindTo = sprite;
    }
    originToCenter() {
        return new DOMMatrix()
            .translateSelf(this.tw, this.th);
    }
}
