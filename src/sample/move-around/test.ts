import { Component } from "../../arch/component.js"
import { ClientInput } from "../../arch/input.js"
import { Level } from "../../arch/level.js"
import { ifLet, match } from "../../arch/match.js"
import { InsertPosition, KNode } from "../../arch/node.js"
import { Animation2D, Animation2DController } from "../../components/animation.js"
import { Sprite } from "../../components/sprite.js"
import { DefaultImageDrawable, IImage } from "../../drawables/image.js"
import { renderSchedulerFactory } from "../../renderer/schedular.js"
import { res } from "../../resource/imageBitmap.js"
import { Option } from '../../arch/match.js'
import { Vec2 } from "../../stl/vec2.js"

const lvl = new Level()
const { scheduler } = renderSchedulerFactory.produce('rAF', renderOnce => {
    lvl.tick()
    lvl.renderLevel(renderOnce)
})

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

const bgRes = await res.bitmap('../../../src/sample/move-around/assets/bg.png').read()
bg.addComponent(
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

const playerIdleRes = await res.bitmap('../../../src/sample/move-around/assets/idle.png').read()
const playerWalkRes = await res.bitmap('../../../src/sample/move-around/assets/run.png').read()
const playerIdleDImage = new DefaultImageDrawable(
    playerIdleRes, 
    0, 0, 400, 400,
    0, 0, 180, 180
)
const playerWalkDImage = new DefaultImageDrawable(
    playerWalkRes, 
    0, 0, 400, 400,
    0, 0, 180, 180
)

player.addComponent(
    Sprite.create<IImage>({
        drawable: playerIdleDImage,
    }),
)

class PlayerAnimController extends Animation2DController {
    readonly walkLeft = Animation2D.fromUV(playerWalkDImage, 1000, true, 1440, 180, 0, 0, 180, 180, 8)
    readonly idle = Animation2D.fromUV(playerIdleDImage, 1000, true, 1980, 180, 0, 0, 180, 180, 11)

    state(str: string): string {
        return match<string>(str) (
            'walk', state => {
                this.play(this.walkLeft)
                return state
            },
            '_', () => {
                this.play(this.idle)
                return 'idle'
            },
        )
    }
}

player.addComponent(new PlayerAnimController())

enum PlayerFacing {
    Right,
    Left,
}

class PlayerController extends Component {
    animController = Option.None<PlayerAnimController>()
    sprite = Option.None<Sprite>()
    velocity: Vec2 = Vec2.from(0, 0)
    facing = PlayerFacing.Right

    start(): void {
        this.animController = Option.Some(this.getComponent(PlayerAnimController))
        this.sprite = Option.Some(this.getComponent(Sprite))
    }

    update(): void {
        this.velocity.x = 0
        this.velocity.y = 0

        if (ClientInput.isKeyPressing('KeyA')) {
            this.velocity.x -= 1
        }

        if (ClientInput.isKeyPressing('KeyD')) {
            this.velocity.x += 1
        }

        if (this.velocity.x) {
            this.facing = this.velocity.x > 0 ? PlayerFacing.Right : PlayerFacing.Left
        }

        ifLet(this.animController, 'Some', controller =>
            {
                this.updateFacing()
                this.updateAnim(controller)
            }
        )
    }
    
    updateAnim(controller: PlayerAnimController) {
        controller.setState(this.velocity.x !== 0 ? 'walk' : 'idle')
    }

    updateFacing() {
        ifLet(this.sprite, 'Some', sprite =>
            {
                match(this.facing) (
                    PlayerFacing.Right, _ => sprite.transform.m11 = 1,
                    PlayerFacing.Left, _ => sprite.transform.m11 = -1,
                )
            }
        )
    }
}

player.addComponent(new PlayerController())

lvl.start()