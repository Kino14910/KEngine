import { Component } from "../arch/component.js";
import { Input } from "../arch/input.js";
import { Level } from "../arch/level.js";
import { InsertPosition, KNode } from "../arch/node.js";
import { Animation2D, AnimationController, Frame2D, IAnimation } from "../components/animation.js";
import { Sprite } from "../components/sprite.js";
import { DefaultImageDrawable, IImage } from "../drawables/image.js";
import { renderSchedulerFactory } from "../renderer/schedular.js";
import { unbox } from "../resource/box.js";
import { imageBitmapRes } from "../resource/imageBitmap.js";

const lvl = new Level()
const { scheduler } = renderSchedulerFactory.produce('rAF', t => lvl.renderLevel(t))

lvl.createPainter(
    document.querySelector('#canvas') as HTMLCanvasElement,
    scheduler
)

const bg = lvl.insert(
    new KNode(
        'bg',
        lvl.Root
    ),
    InsertPosition.Child,
    lvl.Root
)

const bgRes = <ImageBitmap> await unbox(imageBitmapRes('../assets/bg.png'))
const [bgSprite] = bg.addComponent(
    Sprite.create({
        drawable: new DefaultImageDrawable(bgRes, 0, 0, 1920, 1080)
    })
)

const player = lvl.insert(
    new KNode(
        'player',
        lvl.Root,
    ),
    InsertPosition.Child,
    lvl.Root
)

const playerRes = <ImageBitmap> await unbox(imageBitmapRes('../assets/player.png'))
const [ playerSprite ] = player.addComponent(
    Sprite.create<IImage>({
        drawable: new DefaultImageDrawable(
            playerRes, 
            0,0
        )
    })
)

class PlayerAnimController extends AnimationController<Frame2D> {
    readonly testAnim1 = Animation2D.fromUV(560, 184, 0, 0, 46, 46, 48, 1000)

    state(str: string): string {
        if (str === 'walkLeft') {
            this.play(this.testAnim1)
            return 'walkLeft'
        }

        return ''
    }

    drawFrame(frame: Frame2D): void {
        const { sh, sw, sx, sy } = frame
        // console.log(sh, sw, sx, sy)
        const d = playerSprite.drawable
    
        d.sh = sh
        d.sw = sw
        d.sx = sx
        d.sy = sy
    }

}

const [ playerAnimController ] = player.addComponent(new PlayerAnimController())

class PlayerController extends Component {
    start(): void {}
    update(): void {
        if (Input.isKeyPressing('KeyA')) {
            playerAnimController.setState('walkLeft')
        }
    }
    
}

const [ playerController ] = player.addComponent(new PlayerController())
