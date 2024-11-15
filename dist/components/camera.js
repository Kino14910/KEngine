import { Component } from '../arch/component.js';
export class Camera extends Component {
    x = 0;
    y = 0;
    z = -2;
    rotZ = 0;
    fov = 60;
    near = 0.5;
    far = 3;
    start() { }
    update() { }
    getTransform() {
        return new DOMMatrix()
            .translateSelf(-this.x, -this.y, -this.z)
            .rotateAxisAngleSelf(0, 0, 1, -this.rotZ);
    }
}
