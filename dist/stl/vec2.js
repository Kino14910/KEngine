export class Vec2 {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static zero() {
        return new Vec2();
    }
    static from(x, y) {
        return new Vec2(x, y);
    }
    static normalize(v) {
        const m = this.module(v);
        return this.from(v.x / m, v.y / m);
    }
    static module(v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2);
    }
}
