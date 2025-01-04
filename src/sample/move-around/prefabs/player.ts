import { Component } from "../../../arch/component.js"
import { ClientInput } from "../../../arch/input.js"
import { ifLet, match, Option } from "../../../arch/match.js"
import { INode, INodeManager, InsertPosition, KNode, Prefab } from "../../../arch/node.js"
import { Animation2DController, Animation2D } from "../../../components/animation.js"
import { Sprite } from "../../../components/sprite.js"
import { DefaultImageDrawable, IImage } from "../../../drawables/image.js"
import { res } from "../../../resource/imageBitmap.js"
import { Vec2 } from "../../../stl/vec2.js"

export class PlayerPrefab implements Prefab {
    async instantiate(nodeManager: INodeManager) {
        const player = nodeManager.insert(
            new KNode(
                'player',
                nodeManager.Root,
            ),
            InsertPosition.Child,
            nodeManager.Root
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

        return player
    }
}