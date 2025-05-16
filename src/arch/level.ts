import { IDrawable2D } from "../drawables/index.js"
import { LocalCamera } from "../renderer/localCamera.js"
import { Scheduler } from "../renderer/renderer.js"
import { ConstructorOf } from "./component.js"
import { INode, INodeManager, InsertPosition, IPrefabManager, KNode, Prefab, Prefabs } from "./node.js"

export interface IComponentsManager {
    deltaUpdate: number
    start(): void
}

export interface ILevelRenderer {
    dilation: number
    updateLevel(renderOnce: () => void): void
}


export interface RenderInfo {
    drawable: IDrawable2D
    transform: DOMMatrix
    z: number
    alpha: number
    debug: boolean
}

export class Level implements INodeManager, ILevelRenderer, IComponentsManager, IPrefabManager {
    readonly Root: INode = new KNode('root', null as any)

    public dilation = 1

    private _lastUpdateTime = 0
    public deltaUpdate = 0

    calcDeltaUpdate() {
        const now = Date.now()
        this.deltaUpdate = (now - this._lastUpdateTime) * this.dilation
        this._lastUpdateTime = now
    }

    traverse(node: INode, fn: (node: INode, stop: () => void) => void): void {
        let shouldStop = false
        const stop = () => shouldStop = true
        fn(node, stop)
        for (const child of node.childNodes) {
            if (shouldStop) {
                return
            }
            this.traverse(child, fn)
        }
    }

    insert<T extends INode>(node: T, pos: InsertPosition, anchor: INode): T {
        switch(pos) {
            case InsertPosition.Child:
                anchor.childNodes.push(node)
                break
            case InsertPosition.Before: {
                const childNodes = anchor.parent.childNodes
                const index = childNodes.indexOf(anchor)
                childNodes.splice(index, 0, node)
                break
            }
                
            case InsertPosition.After: 
                const childNodes = anchor.parent.childNodes
                const index = childNodes.indexOf(anchor)
                childNodes.splice(index + 1, 0, node)
            break
        }
        return node
    }

    delete(node: INode): void {
        const childNodes = node.parent.childNodes
        const index = childNodes.indexOf(node)
        childNodes.splice(index, 1)
    }

    update(value: INode, old: INode): boolean {
        if (value === old)
            return false
        const childNodes = old.parent.childNodes
        const index = childNodes.indexOf(old)
        childNodes.splice(index, 1, value)
        return true
    }

    find(id: string): INode | null {
        let result: any
        this.traverse(this.Root, (node, stop) => {
            if (node.id === id) {
                result = node
                stop()
            }
        })
        return result
    }

    removeChildren(node: INode): void {
        node.childNodes.length = 0
    }

    updateLevel(beforeRender: () => void): void {
        this.calcDeltaUpdate()
        this.traverse(this.Root, node => node.componentManager.update(this.deltaUpdate, this))

        beforeRender()
    }

    start(): void {
        this.traverse(this.Root, node => node.componentManager.start(node))
    }

    private readonly requiredPrefabs = new Set<ConstructorOf<Prefab>>()

    loadPrefab(prefab: ConstructorOf<Prefab>, parent: INode = this.Root): Promise<INode> | undefined {
        this.requiredPrefabs.add(prefab)
        return Prefabs.instantiate(this, parent, prefab)
    }

    unloadPrefab(prefab: ConstructorOf<Prefab>): void {
        this.requiredPrefabs.delete(prefab)
        Prefabs.destroy(this, prefab)
    }

    loadPrefabs(...prefabs: ConstructorOf<Prefab>[]): Promise<(INode | undefined)[]> {
        return Promise.all(prefabs.map(prefab => this.loadPrefab(prefab)))
    }

    unloadPrefabs(...prefabs: ConstructorOf<Prefab>[]): void {
        prefabs.forEach(prefab => this.unloadPrefab(prefab))
    }

    unloadAllPrefabs(): void {
        this.requiredPrefabs.forEach(prefab => this.unloadPrefab(prefab))
    }
}

export interface Level2DMeta {
    width: number
    height: number
    pixelArt: boolean
    canvas: HTMLCanvasElement
    scheduler: Scheduler
}