import { fetchBlobTransformer } from "./fetchBlob.js"
import { ResMut } from "./res.js"

export class ImageBitmapResource extends ResMut<string, ImageBitmap> {
    private imageBitmap?: Promise<ImageBitmap>
    private cached?: ImageBitmap

    constructor(
        public src: string
    ) {
        super()
        this.update(src)
    }

    read(): Promise<ImageBitmap> {
        return this.imageBitmap as Promise<ImageBitmap>
    }

    unbox() {
        if (this.cached) {
            return this.cached
        }

        throw Error('Cannot unbox a resource which is not loaded.')
    }

    async release() {
        (await this.imageBitmap as ImageBitmap).close()
    }

    update(value: string): void {
        this.imageBitmap = fetchBlobTransformer.transform(value)
            .then(e => createImageBitmap(e))
            .then(bitmap => this.cached = bitmap)
    }
}

export namespace res {
    export const bitmap = (src: string) => new ImageBitmapResource(src)
}