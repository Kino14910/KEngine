export interface Vector2 {
    x: number,
    y: number
}

export class Vec2 implements Vector2 {
    constructor(
        public x = 0,
        public y = 0
    ) {}

    static zero() {
        return new Vec2()
    }

    static from(x:number, y:number) {
        return new Vec2(x, y)
    }

    static normalize(v:Vector2) {
        const m = this.module(v)
        return this.from(
            v.x/m,
            v.y/m
        )
    }

    static module(v: Vector2) {
        return Math.sqrt(v.x**2 + v.y**2)
    }
}