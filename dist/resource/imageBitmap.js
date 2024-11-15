import { box } from "./box.js";
import { fetchBlobTransformer } from "./fetchBlob.js";
import { ResMut } from "./res.js";
export class ImageBitmapRes extends ResMut {
    src;
    imageBitmap;
    constructor(src) {
        super();
        this.src = src;
        this.update(src);
    }
    read() {
        return this.imageBitmap;
    }
    [box.value] = () => this.read();
    async release() {
        (await this.imageBitmap).close();
    }
    update(value) {
        this.imageBitmap = fetchBlobTransformer.transform(value)
            .then(e => createImageBitmap(e));
    }
}
export const imageBitmapRes = (src) => new ImageBitmapRes(src);
