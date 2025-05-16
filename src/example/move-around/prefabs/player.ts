import { Component } from "../../../arch/component.js"
import { ClientInput } from "../../../arch/input.js"
import { ifLet, match, Option } from "../../../arch/match.js"
import { INode, INodeManager, InsertPosition, InstantiateContext, KNode, Prefab } from "../../../arch/node.js"
import { Animation, AnimationControllerComponent } from "../../../components/anim/animation.js"
import { SpriteSheetAnimationTrack } from "../../../components/anim/2d/spriteSheetTrack.js"
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

        const playerIdleRes = await res.bitmap('../../../src/example/move-around/assets/idle.png').read()
        const playerWalkRes = await res.bitmap('../../../src/example/move-around/assets/run.png').read()
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
            Sprite.create({
                drawable: playerIdleDImage,
            }),
        )

        const playerAnimationController = new AnimationControllerComponent()

        playerAnimationController
            .addAnimation(
                new Animation('idle', 1100, true)
                    .addTrack(
                        new SpriteSheetAnimationTrack({
                            spriteResource: playerIdleDImage,
                            originX: 0,
                            originY: 0,
                            width: 1980,
                            height: 180,
                            count: 11,
                            rows: 1,
                            columns: 11,
                        })
                    ),
            )
            .addAnimation(
                new Animation('walk', 800, true)
                    .addTrack(
                        new SpriteSheetAnimationTrack({
                            spriteResource: playerWalkDImage,
                            originX: 0,
                            originY: 0,
                            width: 1440,
                            height: 180,
                            count: 8,
                            rows: 1,
                            columns: 8,
                        })
                    ),
            )

        player.addComponent(playerAnimationController)
        
        enum PlayerFacing {
            Right,
            Left,
        }
        
        class PlayerController extends Component {
            // animController = Option.None<PlayerAnimController>()
            sprite = Option.None<Sprite>()
            velocity: Vec2 = Vec2.from(0, 0)
            facing = PlayerFacing.Right
        
            start(): void {
                // this.animController = Option.Some(this.getComponent(PlayerAnimController))
                this.sprite = Option.Some(this.getComponent(Sprite))
            }

            running = false
        
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

                // this.updateFacing()

                if (this.running && this.velocity.x === 0) {
                    playerAnimationController.playAnimation('idle')
                    this.running = false
                } else if (!this.running && this.velocity.x !== 0) {
                    playerAnimationController.playAnimation('walk')
                    this.running = true
                }
            }
        
            updateFacing() {
                ifLet(this.sprite, 'Some', sprite =>
                    match<number>(this.facing) (
                        PlayerFacing.Right, _ => sprite.transform.m11 = 1,
                        PlayerFacing.Left, _ => sprite.transform.m11 = 0.7,
                    )
                )
            }
        }
        
        player.addComponent(new PlayerController())

        return player
    }

    destroy(context: InstantiateContext, parent: INode): void {
        context.removeChildren(parent)
    }
}