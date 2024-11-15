interface DOMMatrixSelf2DMethods {
    invertSelf(): DOMMatrix;
    rotateAxisAngleSelf(x?: number, y?: number, z?: number, angle?: number): DOMMatrix;
    rotateFromVectorSelf(x?: number, y?: number): DOMMatrix;
    rotateSelf(rotX?: number, rotY?: number, rotZ?: number): DOMMatrix;
    scaleSelf(scaleX?: number, scaleY?: number, scaleZ?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix;
    skewXSelf(sx?: number): DOMMatrix;
    skewYSelf(sy?: number): DOMMatrix;
    translateSelf(tx?: number, ty?: number, tz?: number): DOMMatrix;
    flipX(): DOMMatrix;
    flipY(): DOMMatrix;
    inverse(): DOMMatrix;
    rotate(rotX?: number, rotY?: number, rotZ?: number): DOMMatrix;
    rotateAxisAngle(x?: number, y?: number, z?: number, angle?: number): DOMMatrix;
    rotateFromVector(x?: number, y?: number): DOMMatrix;
    scale(scaleX?: number, scaleY?: number, scaleZ?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix;
    skewX(sx?: number): DOMMatrix;
    skewY(sy?: number): DOMMatrix;
    translate(tx?: number, ty?: number, tz?: number): DOMMatrix;
}


export function transfrom2d<T extends keyof DOMMatrixSelf2DMethods>(
    matrix: DOMMatrix,
    anchor: [number, number],
    method: T,
    ...args: Parameters<DOMMatrixSelf2DMethods[T]>
) {
    let result = matrix.translate(anchor[0], anchor[1])
    result = result[method](...args)
    return result.translate(-anchor[0], -anchor[1])
}


export class Vector extends Float64Array {

    constructor(
        x: number,
        y: number,
        z: number,
    ) {
        super([x, y, z])
    }

    get x() {
        return this[0]
    }
    set x(v) {
        this[0] = v
    }

    get y() {
        return this[1]
    }
    set y(v) {
        this[1] = v
    }

    get z() {
        return this[2]
    }
    set z(v) {
        this[2] = v
    }

    modulo() {
        return Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2)
    }

    addSelf(vec: Vector) {
        this[0] += vec[0]
        this[1] += vec[1]
        this[2] += vec[2]

        return this
    }

    add(vec: Vector) {
        return new Vector(this[0] + vec[0], this[1] + vec[1], this[2] + vec[2])
    }

    multiplySelf(scalar: number) {
        this[0] *= scalar
        this[1] *= scalar
        this[2] *= scalar

        return this
    }

    multiply(scalar: number) {
        return new Vector(this[0] * scalar, this[1] * scalar, this[2] * scalar)
    }

    dot(vec: Vector) {
        return this[0] * vec[0] + this[1] * vec[1] + this[2] * vec[2]
    }

    cross(vec: Vector) {
        return new Vector(
            this[1] * vec[2] - this[2] * vec[1],
            this[2] * vec[0] - this[0] * vec[2],
            this[0] * vec[1] - this[1] * vec[0]
        )
    }

    transform2d(m: DOMMatrix) {
        return Vector.from([
            this[0] * m.a + this[1] * m.b + m.e,
            this[0] * m.c + this[1] * m.d + m.f,
            0
        ]) as Vector
    }

    transform2dSelf(m: DOMMatrix) {
        const x = this[0] * m.a + this[1] * m.b + m.e
        const y = this[0] * m.c + this[1] * m.d + m.f

        this[0] = x
        this[1] = y

        return this
    }

    copy(): Vector {
        return Vector.from([this[0], this[1], this[2]]) as Vector
    }

    static angle(vec1: Vector, vec2: Vector) {
        return Math.acos(vec1.dot(vec2) / (vec1.modulo() * vec2.modulo()))
    }

    static zero() {
        return new Vector(0, 0, 0)
    }

    static unit() {
        return new Vector(1, 0, 0)
    }
}
