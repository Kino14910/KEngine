import { KNode, Prefab, INodeManager, InsertPosition, INode, InstantiateContext } from "../../../arch/node.js"
import { Sprite } from "../../../components/sprite.js"
import { DefaultImageDrawable } from "../../../drawables/image.js"
import { res } from "../../../resource/imageBitmap.js"

export class BackgroundPrefab implements Prefab {
    async instantiate(nodeManager: INodeManager) {
        const bg = nodeManager.insert(
            new KNode(
                'bg',
                nodeManager.Root
            ),
            InsertPosition.Child,
            nodeManager.Root
        )
        
        const bgRes = await res.bitmap('../../../src/example/move-around/assets/bg.png').read()
        bg.addComponent(
            Sprite.create({
                drawable: new DefaultImageDrawable(bgRes, 0, 0, 1920, 1080)
            })
        )

        return bg
    }

    destroy(context: InstantiateContext, parent: INode): void {
        context.removeChildren(parent)
    }
}