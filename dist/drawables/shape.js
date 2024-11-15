export class DefaultDrawable {
    points;
    fillStyle;
    strokeStyle;
    type = "shape";
    constructor(points = [], fillStyle = 'red', strokeStyle = 'black') {
        this.points = points;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
    }
}
