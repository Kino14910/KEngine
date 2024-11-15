export class DefaultTextDrawable {
    position;
    content;
    fontSize;
    maxWidth;
    fillStyle;
    strokeStyle;
    type = "text";
    constructor(position = [50, 90], content = 'Hello world', fontSize = 24, maxWidth = 100, fillStyle = 'black', strokeStyle = 'black') {
        this.position = position;
        this.content = content;
        this.fontSize = fontSize;
        this.maxWidth = maxWidth;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
    }
}
