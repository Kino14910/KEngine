//@ts-ignore
export class Vec3 extends Float64Array {
    get x() {
        return this[0];
    }
    set x(val) {
        this[0] = val;
    }
    get y() {
        return this[0];
    }
    set y(val) {
        this[1] = val;
    }
    get z() {
        return this[2];
    }
    set z(val) {
        this[2] = val;
    }
    constructor(init) {
        super(3);
        this.set(init);
    }
    static from(x, y, z) {
        return new Vec3([x, y, z]);
    }
    static fromVec3(vec3) {
        return new Vec3([vec3.x, vec3.y, vec3.z]);
    }
    static m(vec3) {
        const { x, y, z } = vec3;
        return Math.sqrt(x * x + y * y + z * z);
    }
    m() {
        return Vec3.m(this);
    }
    static isZero(vec) {
        return vec.x === 0 && vec.y === 0 && vec.z === 0;
    }
    isZero() {
        return Vec3.isZero(this);
    }
    static normalize(vec) {
        if (this.isZero(vec)) {
            return false;
        }
        const { x, y, z } = vec;
        const m = this.m(vec);
        vec.x = x / m;
        vec.y = y / m;
        vec.z = z / m;
    }
    n() {
        return Vec3.normalize(this);
    }
    static add(vec1, vec2) {
        return new Vec3([vec1.x + vec2.x, vec1.y + vec2.y, vec1.z + vec2.z]);
    }
    add(vec) {
        return Vec3.add(this, vec);
    }
    static sub(vec1, vec2) {
        return new Vec3([vec1.x - vec2.x, vec1.y - vec2.y, vec1.z - vec2.z]);
    }
    sub(vec) {
        return Vec3.sub(this, vec);
    }
    static mul(vec, scalar) {
        return new Vec3([vec.x * scalar, vec.y * scalar, vec.z * scalar]);
    }
    mul(scalar) {
        return Vec3.mul(this, scalar);
    }
    static div(vec, scalar) {
        return new Vec3([vec.x / scalar, vec.y / scalar, vec.z / scalar]);
    }
    div(scalar) {
        return Vec3.div(this, scalar);
    }
    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
    }
    dot(vec) {
        return Vec3.dot(this, vec);
    }
    static cross(vec1, vec2) {
        return new Vec3([
            vec1.y * vec2.z - vec1.z * vec2.y,
            vec1.z * vec2.x - vec1.x * vec2.z,
            vec1.x * vec2.y - vec1.y * vec2.x
        ]);
    }
    cross(vec) {
        return Vec3.cross(this, vec);
    }
    toString() {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
    }
}
