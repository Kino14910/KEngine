export class DefaultImageDrawable {
    image;
    x;
    y;
    w;
    h;
    sx;
    sy;
    sw;
    sh;
    type = "image";
    constructor(image, x, y, w = image.width, h = image.height, sx = 0, sy = 0, sw = image.width, sh = image.height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
    }
}
