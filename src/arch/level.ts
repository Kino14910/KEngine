import { IDrawable2D } from "../drawables/index.js"
import { DrawReceiver } from "../renderer/drawCommand.js"
import { LocalCamera, LocalCamera3D } from "../renderer/localCamera.js"
import { IPainter, Painter } from "../renderer/painter.js"
import { IRenderer, Renderer2D, Scheduler } from "../renderer/renderer.js"
import { ConstructorOf } from "./component.js"
import { ClientInput } from "./input.js"
import { INode, INodeManager, InsertPosition, IPrefabManager, KNode, Prefab, Prefabs } from "./node.js"

export interface IComponentsManager {
    deltaUpdate: number
    start(): void
}

export interface ILevelRenderer {
    dilation: number
    camera: LocalCamera
    renderLevel(renderOnce: () => void): void
}

export interface IWindowManager {
    getRenderer(): IRenderer
    painter?: IPainter<unknown>
    createPainter(canvas: HTMLCanvasElement, scheduler: Scheduler, pixelArt: boolean): IPainter<unknown>
}

export interface RenderInfo {
    drawable: IDrawable2D
    transform: DOMMatrix
    z: number
    alpha: number
    debug: boolean
}

export class Level implements INodeManager, IWindowManager, ILevelRenderer, IComponentsManager, IPrefabManager {
    readonly Root: INode = new KNode('root', null as any)

    public renderer?: IRenderer
    public painter?: IPainter<unknown>
    public camera: LocalCamera = new LocalCamera3D()
    public dilation = 1

    constructor() {
        ClientInput.registerInput()
    }

    static createFromPrefab(prefab: ConstructorOf<Prefab>) {
        const lvl = new Level()
        lvl.loadPrefab(prefab, lvl.Root)
        return lvl
    }

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

    getRenderer() {
        return this.renderer || (this.renderer = this.painter!.renderer)
    }

    createPainter(canvas: HTMLCanvasElement, scheduler: Scheduler, pixelArt=false): IPainter<unknown> {
        const painter = new Painter(
            new Renderer2D(
                canvas,
                new DrawReceiver(),
                scheduler,
                pixelArt
            )
        )

        return this.painter = painter
    }

    renderLevel(renderOnce: () => void): void {
        if (!this.painter) {
            return
        }

        this.calcDeltaUpdate()
        this.traverse(this.Root, node => node.componentManager.update(this.deltaUpdate, this))
        this.camera.renderLevel(this)

        renderOnce()
    }

    start(): void {
        this.traverse(this.Root, node => node.componentManager.start(node))
    }

    loadPrefab(prefab: ConstructorOf<Prefab>, parent: INode = this.Root): Promise<INode> | undefined {
        return Prefabs.instantiate(this, parent, prefab)
    }
}