export function transfrom2d(matrix, anchor, method, ...args) {
    let result = matrix.translate(anchor[0], anchor[1]);
    result = result[method](...args);
    return result.translate(-anchor[0], -anchor[1]);
}
export class Vector extends Float64Array {
    constructor(x, y, z) {
        super([x, y, z]);
    }
    get x() {
        return this[0];
    }
    set x(v) {
        this[0] = v;
    }
    get y() {
        return this[1];
    }
    set y(v) {
        this[1] = v;
    }
    get z() {
        return this[2];
    }
    set z(v) {
        this[2] = v;
    }
    modulo() {
        return Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2);
    }
    addSelf(vec) {
        this[0] += vec[0];
        this[1] += vec[1];
        this[2] += vec[2];
        return this;
    }
    add(vec) {
        return new Vector(this[0] + vec[0], this[1] + vec[1], this[2] + vec[2]);
    }
    multiplySelf(scalar) {
        this[0] *= scalar;
        this[1] *= scalar;
        this[2] *= scalar;
        return this;
    }
    multiply(scalar) {
        return new Vector(this[0] * scalar, this[1] * scalar, this[2] * scalar);
    }
    dot(vec) {
        return this[0] * vec[0] + this[1] * vec[1] + this[2] * vec[2];
    }
    cross(vec) {
        return new Vector(this[1] * vec[2] - this[2] * vec[1], this[2] * vec[0] - this[0] * vec[2], this[0] * vec[1] - this[1] * vec[0]);
    }
    transform2d(m) {
        return Vector.from([
            this[0] * m.a + this[1] * m.b + m.e,
            this[0] * m.c + this[1] * m.d + m.f,
            0
        ]);
    }
    transform2dSelf(m) {
        const x = this[0] * m.a + this[1] * m.b + m.e;
        const y = this[0] * m.c + this[1] * m.d + m.f;
        this[0] = x;
        this[1] = y;
        return this;
    }
    copy() {
        return Vector.from([this[0], this[1], this[2]]);
    }
    static angle(vec1, vec2) {
        return Math.acos(vec1.dot(vec2) / (vec1.modulo() * vec2.modulo()));
    }
    static zero() {
        return new Vector(0, 0, 0);
    }
    static unit() {
        return new Vector(1, 0, 0);
    }
}
