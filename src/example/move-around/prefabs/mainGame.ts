import { INode, InstantiateContext, Prefab } from "../../../arch/node"
import { schedulerFactory } from "../../../renderer/schedular.js"
import { BackgroundPrefab } from "./background.js"
import { PlayerPrefab } from "./player.js"

export class MainGame implements Prefab {
    static prefabs = [
        BackgroundPrefab,
        PlayerPrefab,
    ]

    createRenderer(context: InstantiateContext) {
        const { scheduler } = schedulerFactory.produce('rAF', renderOnce => context.renderLevel(renderOnce))

        context.createPainter(
            document.querySelector('#canvas') as HTMLCanvasElement,
            scheduler,
            true
        )
    }

    async loadPrefabs(context: InstantiateContext) {
        await Promise.all(MainGame.prefabs.map(prefabCtor => context.loadPrefab(prefabCtor)))
    }

    async instantiate(context: InstantiateContext, parent: INode): Promise<INode> {
        this.createRenderer(context)
        await this.loadPrefabs(context)
        context.start()
        return parent
    }

}