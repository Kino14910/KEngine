import { INode, InstantiateContext, Prefab } from "../../../arch/node"
import { BackgroundPrefab } from "./background.js"
import { PlayerPrefab } from "./player.js"

export class MainGame implements Prefab {
    static prefabs = [
        BackgroundPrefab,
        PlayerPrefab,
    ]

    async loadPrefabs(context: InstantiateContext) {
        await Promise.all(MainGame.prefabs.map(prefabCtor => context.loadPrefab(prefabCtor)))
    }

    async instantiate(context: InstantiateContext, parent: INode): Promise<INode> {
        await this.loadPrefabs(context)
        context.start()
        return parent
    }

    destroy(context: InstantiateContext, parent: INode): void {
        context.unloadAllPrefabs()
    }
}