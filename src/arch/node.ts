import { ComponentManager, ConstructorOf, IComponent, IComponentManager } from "./component.js"
import { Level } from "./level.js"

export interface INode {
    readonly id: string
    readonly componentManager: IComponentManager
    readonly childNodes: INode[]
    readonly parent: INode
    getComponent<T = IComponent>(ctor: ConstructorOf<T>): T | undefined
    addComponent(...component: IComponent[]): IComponent[]
}

export class KNode implements INode {
    constructor(
        readonly id: string,
        readonly parent: INode,
        readonly componentManager: IComponentManager = new ComponentManager(),
        readonly childNodes: INode[] = []
    ) {}

    getComponent<T = IComponent>(ctor: ConstructorOf<T>): T | undefined {
        return this.componentManager.get(ctor)
    }

    addComponent<T extends IComponent[]>(...component: T): { [P in keyof T]: T[P] } {
        this.componentManager.add(this, ...component)
        return component
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
}

export interface Prefab {
    instantiate(nodeManager: INodeManager, parent: INode): Promise<INode>
}

export class Prefabs {
    static prefabs = new Map<ConstructorOf<Prefab>, Prefab>()
    static async instantiate(lvl: Level, parent: INode, prefab: ConstructorOf<Prefab>) {
        let prefabInstance = Prefabs.prefabs.get(prefab)
        if (!prefabInstance) {
            prefabInstance = Reflect.construct(prefab, [])
            Prefabs.prefabs.set(prefab, prefabInstance)
        }

        return prefabInstance.instantiate(lvl, parent)
    }
}

export interface IPrefabManager {
    loadPrefab(prefab: ConstructorOf<Prefab>, parent?: INode): Promise<INode>
}