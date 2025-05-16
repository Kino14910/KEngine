import { IImage } from "../drawables/image.js"
import { IDrawable2D } from "../drawables/index.js"
import { IShape } from "../drawables/shape.js"
import { IText } from "../drawables/text.js"

export class Painter {
    draw(ctx: CanvasRenderingContext2D, drawable: IDrawable2D, transform=new DOMMatrix()) {
        if (drawable.type === "shape") {
            this.paintShape(ctx, transform, drawable as IShape)
        } else if (drawable.type === "text") {
            this.paintText(ctx, transform, drawable as IText)
        } else if(drawable.type === 'image') {
            this.paintImage(ctx, transform, drawable as IImage)
        }
    }

    private paintShape(ctx: CanvasRenderingContext2D, transfrom: DOMMatrix, {points, fillStyle, strokeStyle}: IShape) {
        ctx.setTransform(transfrom)
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for(let i=1; i<points.length; i++) {
            const { x, y } = points[i]
            ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = fillStyle
        ctx.strokeStyle = strokeStyle
        ctx.fill()
        ctx.stroke()
        ctx.resetTransform()
    }

    private paintText(ctx: CanvasRenderingContext2D, transfrom: DOMMatrix, {position, fontSize, fillStyle, strokeStyle, content, maxWidth}: IText) {
        ctx.setTransform(transfrom)
        const { x, y } = position
        ctx.font = `${fontSize}px sans-serif`
        ctx.fillStyle = fillStyle
        ctx.strokeStyle = strokeStyle
        
        //根据 maxWidth 来截断文本
        // Measure text width
        let truncatedContent = content
        let textWidth = ctx.measureText(truncatedContent).width

        // Truncate if necessary
        if (textWidth > maxWidth) {
            while (textWidth > maxWidth && truncatedContent.length > 0) {
                truncatedContent = truncatedContent.slice(0, -1)
                textWidth = ctx.measureText(truncatedContent + '…').width // Add ellipsis for indication
            }
            truncatedContent += '…' // Append ellipsis after truncation
        }

        // Draw the truncated text
        ctx.fillText(truncatedContent, x, y, maxWidth)
        ctx.resetTransform()
    }

    private paintImage(ctx: CanvasRenderingContext2D, transfrom: DOMMatrix, {image, x, y, w, h, sx, sy, sw, sh}: IImage) {
        ctx.setTransform(transfrom)
        ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h)
        ctx.resetTransform()
    }
}
