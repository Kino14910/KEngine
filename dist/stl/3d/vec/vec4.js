import { Matrix } from "../mat/mat4.js";
//@ts-ignore
export class Vec4 extends Float64Array {
    x = 0;
    y = 0;
    z = 0;
    w = 0;
    constructor(init) {
        super(3);
        this.set(init);
    }
    static from(x, y, z, w) {
        return new Vec4([x, y, z, w]);
    }
    static fromVec3(vec3) {
        return new Vec4([vec3.x, vec3.y, vec3.z]);
    }
    static fromVec4(vec4) {
        return new Vec4([vec4.x, vec4.y, vec4.z, vec4.w]);
    }
    static m(vec) {
        const { x, y, z, w } = vec;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }
    m() {
        return Vec4.m(this);
    }
    static isZero(vec) {
        return vec.x === 0 && vec.y === 0 && vec.z === 0 && vec.w === 0;
    }
    isZero() {
        return Vec4.isZero(this);
    }
    static normalize(vec) {
        if (this.isZero(vec)) {
            return false;
        }
        const { x, y, z, w } = vec;
        const m = this.m(vec);
        vec.x = x / m;
        vec.y = y / m;
        vec.z = z / m;
        vec.w = w / m;
    }
    n() {
        return Vec4.normalize(this);
    }
    static add(vec1, vec2) {
        return new Vec4([vec1.x + vec2.x, vec1.y + vec2.y, vec1.z + vec2.z, vec1.w + vec2.w]);
    }
    add(vec) {
        return Vec4.add(this, vec);
    }
    static sub(vec1, vec2) {
        return new Vec4([vec1.x - vec2.x, vec1.y - vec2.y, vec1.z - vec2.z, vec1.w - vec2.w]);
    }
    sub(vec) {
        return Vec4.sub(this, vec);
    }
    static mul(vec, scalar) {
        return new Vec4([vec.x * scalar, vec.y * scalar, vec.z * scalar, vec.w * scalar]);
    }
    mul(scalar) {
        return Vec4.mul(this, scalar);
    }
    static div(vec, scalar) {
        return new Vec4([vec.x / scalar, vec.y / scalar, vec.z / scalar, vec.w / scalar]);
    }
    div(scalar) {
        return Vec4.div(this, scalar);
    }
    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z + vec1.w * vec2.w;
    }
    dot(vec) {
        return Vec4.dot(this, vec);
    }
    static multiply(vec, mat) {
        return Matrix.multiply(mat, vec);
    }
    multiply(mat) {
        return Vec4.multiply(this, mat);
    }
    toString() {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}, ${this.w.toFixed(2)})`;
    }
}
