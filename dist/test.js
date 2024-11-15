import { Circle } from "./drawables/circle.js";
import { RoundedRectangle } from "./drawables/roundedRect.js";
import { DefaultTextDrawable } from "./drawables/text.js";
import { DrawReceiver } from "./renderer/drawCommand.js";
import { Painter } from "./painter/painter.js";
import { Renderer } from "./renderer/renderer.js";
import { renderSchedulerFactory } from "./renderer/schedular.js";
import { DefaultImageDrawable } from "./drawables/image.js";
const { scheduler, stop } = renderSchedulerFactory.produce('rAF', fn => {
    clearScreen();
    fn();
});
const renderer = new Renderer(document.querySelector('#canvas'), new DrawReceiver(), scheduler);
function clearScreen() {
    renderer.render((ctx) => () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });
}
const painter1 = new Painter(renderer);
const circle = Circle.create(400, 400, 100, 100);
painter1.paint(circle);
const roundedRectangle = RoundedRectangle.create(100, 100, 100, 100, 10, 10, 10, 10);
painter1.paint(roundedRectangle);
const testTextDrawable = new DefaultTextDrawable([300, 150], 'Hello Beatiful World', 30, 200, 'red', 'blue');
// const textDrawable = new DefaultTextDrawable();
// const painter2 = new Painter(document.getElementById("canvas") as HTMLCanvasElement)
painter1.paint(testTextDrawable);
const imgRes = await fetch('https://www.bilibili.com/?spm_id_from=333.788.0.0');
const img = await imgRes.blob();
const testImageDrawable = new DefaultImageDrawable(await createImageBitmap(img), 0, 0);
painter1.paint(testImageDrawable);
// painter1.paint(testImageDrawable)
