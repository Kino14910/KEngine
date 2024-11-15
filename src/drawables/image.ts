export interface IImage {
    readonly type: 'image'
    image: ImageBitmap
    sx: number
    sy: number
    sw: number
    sh: number
    x: number
    y: number
    w: number
    h: number
}


export class DefaultImageDrawable implements IImage {
    readonly type = "image"
    constructor(
        public image: ImageBitmap,
        public x: number,
        public y: number,
        public w: number = image.width,
        public h: number = image.height,
        public sx: number = 0,
        public sy: number = 0,
        public sw: number = image.width,
        public sh: number = image.height,
    ){}
    
}

