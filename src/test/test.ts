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
    scheduler,
    true
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

const playerIdleRes = <ImageBitmap> await unbox(imageBitmapRes('../assets/idle.png'))
const playerRunRes = <ImageBitmap> await unbox(imageBitmapRes('../assets/run.png'))
const [ playerSprite, playerRunSprite ] = player.addComponent(
    Sprite.create<IImage>({
        drawable: new DefaultImageDrawable(
            playerRunRes, 
            0, 0, 400, 400,
            0, 0, 180, 180
        )
    }),
    Sprite.create<IImage>({
        drawable: new DefaultImageDrawable(
            playerIdleRes, 
            0, 0, 400, 400,
            0, 0, 180, 180
        )
    }),
)

class PlayerAnimController extends AnimationController<Frame2D> {
    readonly walkLeft = Animation2D.fromUV(playerRunSprite, 1000, true, 1440, 180, 0, 0, 180, 180, 8)
    readonly idle = Animation2D.fromUV(playerSprite, 1000, true, 1980, 180, 0, 0, 180, 180, 11)

    state(str: string): string {
        if (str === 'walkLeft') {
            this.play(this.walkLeft)
            return 'walkLeft'
        }

        if (str === 'idle') {
            // this.play(this.idle)

            return 'idle'
        }

        return 'idleright'
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
    facing: string = 'right'

    start(): void {

    }

    update(): void {
        this.updateAnim()
    }
    
    updateAnim() {
        if (Input.isKeyPressing('KeyA')) {
            return playerAnimController.setState('walkLeft')
        }

        playerAnimController.setState('idle' + this.facing)
    }

    updateFacing() {
        if (this.facing === 'right') {
            
        }
    }
}

const [ playerController ] = player.addComponent(new PlayerController())
