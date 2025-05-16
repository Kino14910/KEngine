import { Level } from "./level.js"
import { INode } from "./node.js"

export type ConstructorOf<T> = new (...args: any[]) => T

export function constructorOf<T>(inst: T): ConstructorOf<T> {
    //@ts-ignore
    return Reflect.getPrototypeOf(inst).constructor
}

export interface IComponent {
    start?(manager: IComponentManager, node: INode): void
    update?(dt: number): void
    tick?(dt: number): void
    destroy?(): void
    getNode(): INode
    getComponentManager(): IComponentManager
    getAncestorComponents<T extends IComponent = IComponent>(ctor: ConstructorOf<T>, toAncestor?: INode): T[]
    getComponent<T extends IComponent = IComponent>(ctor: ConstructorOf<T>): T | undefined
}

export interface ITickableComponent {
    tick(dt: number, lvl: Level): void
}

export interface IComponentManager{
    get<T extends IComponent = IComponent>(ctor: ConstructorOf<T>): T | undefined
    add(...component: IComponent[]): void
    remove(...ctors: ConstructorOf<IComponent>[]): void
    clear(): void
    update(dt: number, lvl: Level): void
    start(node: INode): void
    tick(dt: number, lvl: Level): void
}

export class ComponentManager implements IComponentManager {
    static MANAGER_TAG = Symbol('COMPONENT_MANAGER')
    static NODE_TAG = Symbol('NODE_TAG')

    private components = new Map<ConstructorOf<IComponent>, IComponent>()

    constructor(
        readonly node: INode
    ) {}

    get<T extends IComponent = IComponent>(ctor: ConstructorOf<T>): T | never {
        const target = this.components.get(ctor)
        if (!target) {
            throw Error(`Unkown component named ${ctor.name}`)
        }
    
        return target as T
    }

    add(...component: IComponent[]): void {
        for (const comp of component) {
            //@ts-ignore
            if (!comp[ComponentManager.MANAGER_TAG]) {
                //@ts-ignore
                comp[ComponentManager.MANAGER_TAG] = this
                //@ts-ignore
                comp[ComponentManager.NODE_TAG] = this.node
            }

            const ctor = constructorOf(comp)
            let component = this.components.get(ctor)
            if (component) {
                this.components.set(ctor, comp)
                continue
            }

            this.components.set(ctor, comp)
        }
    }

    remove(...ctors: ConstructorOf<IComponent>[]): void {
        for (const ctor of ctors) {
            const comp = this.components.get(ctor)
            if (!comp) {
                continue
            }

            this.components.delete(ctor)
        }
    }

    start(node: INode) {
        this.components.forEach(c => c?.start?.(this, node))
    }

    clear(): void {
        this.components.clear()
    }

    update(dt: number): void {
        this.components.forEach(c => c?.update?.(dt))
    }

    tick(dt: number): void {
        this.components.forEach(c => c?.tick?.(dt))
    }

}

export abstract class Component implements IComponent {
    start(): void {}
    update(dt: number): void {}

    getNode(): INode {
        //@ts-ignore
        return this[ComponentManager.NODE_TAG]
    }

    getComponentManager(): IComponentManager {
        //@ts-ignore
        return this[ComponentManager.MANAGER_TAG]
    }

    getAncestorComponents<T extends IComponent>(ctor: ConstructorOf<T>, toAncestor?: INode): T[] {
        const result: T[] = []
        let self = this.getNode().parent

        if (!self) {
            return result
        }

        while (self !== toAncestor && self.parent) {
            const component = self.componentManager.get(ctor)
            if (component) {
                result.unshift(component)
            }
            self = self.parent
        }

        return result
    }

    getComponent<T extends IComponent>(ctor: ConstructorOf<T>): T | undefined {
        return this.getComponentManager().get(ctor)
    }
}