import { Level } from "./level.js"
import { INode } from "./node.js"

export type ConstructorOf<T> = new (...args: any[]) => T

export function constructorOf<T>(inst: T): ConstructorOf<T> {
    //@ts-ignore
    return Reflect.getPrototypeOf(inst).constructor
}

export interface IComponent {
    start(manager: IComponentManager, node: INode): void
    update(lvl: Level): void
    tick?(lvl: Level): void
    getNode(): INode
    getComponentManager(): IComponentManager
    getAncestorComponents<T=IComponent>(ctor: ConstructorOf<T>, toAncestor?: INode): T[]
    getComponent<T=IComponent>(ctor: ConstructorOf<T>): T | undefined
}

export interface IComponentManager{
    get<T = IComponent>(ctor: ConstructorOf<T>): T | undefined
    add(node: INode, ...component: IComponent[]): void
    clear(): void
    updateComponents(lvl: Level): void
    tickComponents(lvl: Level): void
    start(node: INode): void
}

export class ComponentManager implements IComponentManager {
    static MANAGER_TAG = Symbol('COMPONENT_MANAGER')
    static NODE_TAG = Symbol('NODE_TAG')

    private components = new Map<ConstructorOf<IComponent>, IComponent>()

    get<T = IComponent>(ctor: ConstructorOf<T>): T | never {
        const target = this.components.get(ctor as ConstructorOf<IComponent>)
        if (!target) {
            throw Error(`Unkown component named ${ctor.name}`)
        }
    
        return target as T
    }

    add(node: INode, ...component: IComponent[]): void {
        for (const comp of component) {
            //@ts-ignore
            if (!comp[ComponentManager.MANAGER_TAG]) {
                //@ts-ignore
                comp[ComponentManager.MANAGER_TAG] = this
                //@ts-ignore
                comp[ComponentManager.NODE_TAG] = node
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

    start(node: INode) {
        this.components.forEach(c => c.start(this, node))
    }

    clear(): void {
        this.components.clear()
    }

    updateComponents(lvl: Level): void {
        this.components.forEach(c => c.update(lvl))
    }

    tickComponents(lvl: Level): void {
        this.components.forEach(c => c.tick?.(lvl))
    }
}

export abstract class Component implements IComponent {
    abstract start(): void
    abstract update(lvl: Level): void

    getNode(): INode {
        //@ts-ignore
        return this[ComponentManager.NODE_TAG]
    }

    getComponentManager(): IComponentManager {
        //@ts-ignore
        return this[ComponentManager.MANAGER_TAG]
    }

    getAncestorComponents<T=IComponent>(ctor: ConstructorOf<T>, toAncestor?: INode): T[] {
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

    getComponent<T = IComponent>(ctor: ConstructorOf<T>): T | undefined {
        return this.getComponentManager().get(ctor)
    }
}