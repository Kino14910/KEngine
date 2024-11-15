export class Painter {
    renderer;
    constructor(renderer) {
        this.renderer = renderer;
    }
    paint(drawable) {
        if (drawable.type === "shape") {
            this.paintShape(drawable);
        }
        else if (drawable.type === "text") {
            this.paintText(drawable);
        }
        else if (drawable.type === 'image') {
            this.paintImage(drawable);
        }
    }
    paintShape({ points, fillStyle, strokeStyle }) {
        this.renderer.render((ctx) => () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
        });
    }
    paintText({ position, fontSize, fillStyle, strokeStyle, content, maxWidth }) {
        this.renderer.render(ctx => () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
        });
    }
    paintImage({ image, x, y, w, h, sx, sy, sw, sh }) {
        this.renderer.render((ctx) => () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
        });
    }
}
