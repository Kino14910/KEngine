import { Component } from '../arch/component.js';
export class Sprite extends Component {
    drawable;
    transform;
    anchor;
    z;
    alpha;
    debug;
    static create({ drawable, anchor, transform, z, alpha, debug }) {
        return new Sprite(
        //@ts-ignore
        drawable, transform ?? new DOMMatrix(), anchor ?? [0.5, 0.5], z ?? 0, alpha ?? 1, debug ?? false);
    }
    constructor(drawable, transform = new DOMMatrix(), anchor = [0.5, 0.5], z = 0, alpha = 1, debug = false) {
        super();
        this.drawable = drawable;
        this.transform = transform;
        this.anchor = anchor;
        this.z = z;
        this.alpha = alpha;
        this.debug = debug;
    }
    start() { }
    update(lvl) {
        lvl.recordRenderInfo(this.drawable, this.getAncestorComponents(Sprite)
            .flat()
            .reduce((pre, cur) => {
            return pre.multiply(cur.transform);
        }, this.transform.translate(...this.getAnchoredTranslate())), this.z, this.alpha, this.debug);
    }
    getAnchoredTranslate() {
        const [ax, ay] = this.anchor;
        switch (this.drawable.type) {
            case 'image': {
                const { w, h } = this.drawable;
                return [
                    -w * ax,
                    -h * ay
                ];
            }
            case 'shape': {
                const { points } = this.drawable;
                const p1 = points[0];
                let left = p1[0], right = p1[0], top = p1[0], bottom = p1[1];
                points.slice(1).forEach(([x, y]) => {
                    if (x < left) {
                        left = x;
                    }
                    if (x > right) {
                        right = x;
                    }
                    if (y < top) {
                        top = y;
                    }
                    if (y > bottom) {
                        bottom = y;
                    }
                });
                const w = left - right;
                const h = top - bottom;
                return [
                    w * ax,
                    h * ay
                ];
            }
            case 'text': {
                return [0, 0];
            }
        }
    }
}
