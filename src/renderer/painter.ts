import { IImage } from "../drawables/image.js";
import { IDrawable } from "../drawables/index.js";
import { IShape } from "../drawables/shape.js";
import { IText } from "../drawables/text.js";
import { Renderer } from "../renderer/renderer.js";

export interface IPainter {
    readonly renderer: Renderer
    paint(draw: IDrawable, transform?: DOMMatrix): void
}

export interface PainterScheduler {
    (execute: () => void): void
}

export class Painter implements IPainter {
    constructor(
        public renderer:Renderer
    ){}

    paint(drawable: IDrawable, transform=new DOMMatrix()) {
        if (drawable.type === "shape") {
            this.paintShape(transform, drawable as IShape);
        } else if (drawable.type === "text") {
            this.paintText(transform, drawable as IText);
        } else if(drawable.type === 'image') {
            this.paintImage(transform, drawable as IImage)
        }
    }

    private paintShape(transfrom: DOMMatrix, {points, fillStyle, strokeStyle}: IShape) {
        this.renderer.render((ctx) => () => {
                    ctx.setTransform(transfrom)
                    ctx.beginPath()
                    ctx.moveTo(points[0][0], points[0][1])
                    for(let i=1; i<points.length; i++) {
                        const [x, y] = points[i]
                        ctx.lineTo(x, y)
                    }
                    ctx.closePath()
                    ctx.fillStyle = fillStyle
                    ctx.strokeStyle = strokeStyle
                    ctx.fill()
                    ctx.stroke()
                    ctx.resetTransform()
        })
    }

    private paintText(transfrom: DOMMatrix, {position, fontSize, fillStyle, strokeStyle, content, maxWidth}: IText) {
        this.renderer.render(ctx => () => {
                ctx.setTransform(transfrom)
                const [x, y] = position
                ctx.font = `${fontSize}px sans-serif`
                ctx.fillStyle = fillStyle
                ctx.strokeStyle = strokeStyle
                
                //根据 maxWidth 来截断文本
                // Measure text width
                let truncatedContent = content;
                let textWidth = ctx.measureText(truncatedContent).width;
        
                // Truncate if necessary
                if (textWidth > maxWidth) {
                    while (textWidth > maxWidth && truncatedContent.length > 0) {
                        truncatedContent = truncatedContent.slice(0, -1);
                        textWidth = ctx.measureText(truncatedContent + '…').width; // Add ellipsis for indication
                    }
                    truncatedContent += '…'; // Append ellipsis after truncation
                }

                // Draw the truncated text
                ctx.fillText(truncatedContent, x, y, maxWidth)
                ctx.resetTransform()
        })
    }

    private paintImage(transfrom: DOMMatrix, {image, x, y, w, h, sx, sy, sw, sh}: IImage) {
        this.renderer.render((ctx) => () => {
            ctx.setTransform(transfrom)
            ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h)
            ctx.resetTransform()
        })
    }
}
