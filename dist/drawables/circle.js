import { DefaultDrawable } from "./shape.js";
export class Circle extends DefaultDrawable {
    static create(x, y, r, species) {
        if (species < 3)
            throw Error('Invalid species');
        let dTheta = 2 * Math.PI / species;
        let points = [];
        for (let i = 0; i < species; i++) {
            let theta = i * dTheta;
            let x1 = x + r * Math.cos(theta);
            let y1 = y + r * Math.sin(theta);
            points.push([x1, y1]);
        }
        return new Circle(points);
    }
}
