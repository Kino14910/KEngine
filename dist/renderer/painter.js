export class Painter {
    renderer;
    constructor(renderer) {
        this.renderer = renderer;
    }
    paint(drawable, transform = new DOMMatrix()) {
        if (drawable.type === "shape") {
            this.paintShape(transform, drawable);
        }
        else if (drawable.type === "text") {
            this.paintText(transform, drawable);
        }
        else if (drawable.type === 'image') {
            this.paintImage(transform, drawable);
        }
    }
    paintShape(transfrom, { points, fillStyle, strokeStyle }) {
        this.renderer.render((ctx) => () => {
            ctx.setTransform(transfrom);
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                const [x, y] = points[i];
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.strokeStyle = strokeStyle;
            ctx.fill();
            ctx.stroke();
            ctx.resetTransform();
        });
    }
    paintText(transfrom, { position, fontSize, fillStyle, strokeStyle, content, maxWidth }) {
        this.renderer.render(ctx => () => {
            ctx.setTransform(transfrom);
            const [x, y] = position;
            ctx.font = `${fontSize}px sans-serif`;
            ctx.fillStyle = fillStyle;
            ctx.strokeStyle = strokeStyle;
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
            ctx.fillText(truncatedContent, x, y, maxWidth);
            ctx.resetTransform();
        });
    }
    paintImage(transfrom, { image, x, y, w, h, sx, sy, sw, sh }) {
        this.renderer.render((ctx) => () => {
            ctx.setTransform(transfrom);
            ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
            ctx.resetTransform();
        });
    }
}
