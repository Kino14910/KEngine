import { ComponentManager, ConstructorOf, IComponent, IComponentManager } from "./component.js"
import { IComponentsManager, ILevelRenderer, Level } from "./level.js"

export interface INode {
    readonly id: string
    readonly componentManager: IComponentManager
    readonly childNodes: INode[]
    readonly parent: INode
    getComponent<T extends IComponent = IComponent>(ctor: ConstructorOf<T>): T | undefined
    addComponent(...component: IComponent[]): IComponent[]
    removeComponent(...component: ConstructorOf<IComponent>[]): void
}

export class KNode implements INode {
    readonly componentManager: IComponentManager

    constructor(
        readonly id: string,
        readonly parent: INode,
        componentManager?: IComponentManager,
        readonly childNodes: INode[] = []
    ) {
        this.componentManager = componentManager ?? new ComponentManager(this)
    }

    getComponent<T extends IComponent = IComponent>(ctor: ConstructorOf<T>): T | undefined {
        return this.componentManager.get(ctor)
    }

    addComponent<T extends IComponent[]>(...component: T): { [P in keyof T]: T[P] } {
        this.componentManager.add(...component)
        return component
    }

    removeComponent(...component: ConstructorOf<IComponent>[]): void {
        this.componentManager.remove(...component)
    }
}

export enum InsertPosition {
    Child,
    Before,
    After
}

export interface INodeManager {
    readonly Root: INode
    traverse(node: INode, fn: (node: INode) => void): void
    insert(node: INode, pos: InsertPosition, anchor: INode): INode
    delete(node: INode): void
    update(value: INode, old: INode): boolean
    find(id: string): INode | null
    removeChildren(node: INode): void
}

export type InstantiateContext = INodeManager & ILevelRenderer & IComponentsManager & IPrefabManager

export interface Prefab {
    instantiate(context: InstantiateContext, parent: INode): Promise<INode>
    destroy(context: InstantiateContext, parent: INode): void
}

export class Prefabs {
    static readonly prefabs = new Map<ConstructorOf<Prefab>, Prefab>()
    static readonly prefabNodeMapping = new Map<Prefab, INode>()

    static instantiate(lvl: Level, parent: INode, prefab: ConstructorOf<Prefab>): Promise<INode> | undefined {
        let prefabInstance = Prefabs.prefabs.get(prefab)
        if (!prefabInstance) {
            prefabInstance = Reflect.construct(prefab, [])
            if (prefabInstance) {
                Prefabs.prefabs.set(prefab, prefabInstance)
            }
        }

        this.prefabNodeMapping.set(prefabInstance, parent)

        return prefabInstance?.instantiate?.(lvl, parent)
    }

    static destroy(lvl: Level, prefab: ConstructorOf<Prefab>): void {
        const prefabInstance = Prefabs.prefabs.get(prefab)
        if (prefabInstance) {
            prefabInstance.destroy(lvl, this.prefabNodeMapping.get(prefabInstance)!)
            Prefabs.prefabNodeMapping.delete(prefabInstance)
        }

        Prefabs.prefabs.delete(prefab)
    }
}

export interface IPrefabManager {
    loadPrefab(prefab: ConstructorOf<Prefab>, parent?: INode): Promise<INode> | undefined
    unloadPrefab(prefab: ConstructorOf<Prefab>): void
    loadPrefabs(...prefabs: ConstructorOf<Prefab>[]): Promise<(INode | undefined)[]>
    unloadPrefabs(...prefabs: ConstructorOf<Prefab>[]): void
    unloadAllPrefabs(): void
}