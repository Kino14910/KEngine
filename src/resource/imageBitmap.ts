import { box } from "./box.js";
import { fetchBlobTransformer } from "./fetchBlob.js";
import { Res, ResMut } from "./res.js";

export class ImageBitmapRes extends ResMut<string, ImageBitmap> {
    private imageBitmap?: Promise<ImageBitmap>

    constructor(
        public src: string
    ) {
        super()
        this.update(src)
    }

    read(): Promise<ImageBitmap> {
        return this.imageBitmap as Promise<ImageBitmap>
    }

    [box.value] = () => this.read()

    async release() {
        (await this.imageBitmap as ImageBitmap).close()
    }

    update(value: string): void {
        this.imageBitmap = fetchBlobTransformer.transform(value)
            .then(e => createImageBitmap(e))
    }
}

export const imageBitmapRes = (src: string): Res<ImageBitmap> => new ImageBitmapRes(src)