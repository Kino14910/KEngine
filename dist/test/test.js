import { Level } from "../arch/level.js";
import { InsertPosition, KNode } from "../arch/node.js";
import { Animation2D } from "../components/animation.js";
import { Sprite } from "../components/sprite.js";
import { DefaultImageDrawable } from "../drawables/image.js";
import { renderSchedulerFactory } from "../renderer/schedular.js";
import { unbox } from "../resource/box.js";
import { imageBitmapRes } from "../resource/imageBitmap.js";
const lvl = new Level();
const { scheduler } = renderSchedulerFactory.produce('rAF', t => lvl.renderLevel(t));
lvl.createPainter(document.querySelector('#canvas'), scheduler);
const bg = lvl.insert(new KNode('bg', lvl.Root), InsertPosition.Child, lvl.Root);
const bgRes = await unbox(imageBitmapRes('../assets/bg.png'));
const [bgSprite] = bg.addComponent(Sprite.create({
    drawable: new DefaultImageDrawable(bgRes, 0, 0, 1920, 1080)
}));
const player = lvl.insert(new KNode('player', lvl.Root), InsertPosition.Child, lvl.Root);
const playerRes = await unbox(imageBitmapRes('../assets/player.png'));
const [playerSprite] = player.addComponent(Sprite.create({
    drawable: new DefaultImageDrawable(playerRes, 0, 0)
}));
Animation2D.fromUV(560, 184, 0, 0, 46, 46, 48, 480);
