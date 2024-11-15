import { IDrawable } from "../drawables/index.js"
import { Point } from "../drawables/Point.js"
import { Camera2D } from "../renderer/camera.js"
import { DrawReceiver } from "../renderer/drawCommand.js"
import { IPainter, Painter } from "../renderer/painter.js"
import { IRenderer, Renderer, RenderScheduler } from "../renderer/renderer.js"
import { Input } from "./input.js"
import { INode, INodeManager, InsertPosition, KNode } from "./node.js"

export interface ILevelRenderer {
    camera?: Camera2D
    renderLevel(tick: () => void): void
    recordRenderInfo(drawable: IDrawable, transform: DOMMatrix, z: number, alpha: number, debug: boolean): void
}

export interface IWindowManager {
    getRenderer(): IRenderer
    painter?: IPainter
    createPainter(canvas: HTMLCanvasElement, scheduler: RenderScheduler): IPainter
}

export class Level implements INodeManager, IWindowManager, ILevelRenderer {
    readonly Root: INode = new KNode('root', null as any)

    public renderer?: IRenderer
    public painter?: IPainter
    public camera?: Camera2D

    constructor() {
        Input.registerInput()
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

    createPainter(canvas: HTMLCanvasElement, scheduler: RenderScheduler): IPainter {
        const painter = new Painter(
            new Renderer(
                canvas,
                new DrawReceiver(),
                scheduler
            )
        )

        this.camera = new Camera2D(
            'defaultCamera',
            this.Root,
            canvas.width,
            canvas.height
        )

        return this.painter = painter
    }

    recordRenderInfo(
        drawable: IDrawable, transform: DOMMatrix,
        z: number, alpha: number, debug: boolean
    ) {
        if (z < this.camera!.near || z > this.camera!.far) {
            return
        }

        this.renderInfoList.push({ drawable, transform, z, alpha, debug })
    }

    private readonly renderInfoList: RenderInfo[] = []

    private culling(renderInfoList: RenderInfo[]): RenderInfo[] {
        const orderedRenderInfoList = renderInfoList.splice(0, renderInfoList.length)
            .toSorted((a, b) => a.z - b.z)

        const { w, h, x, y, z, fov } = this.camera!
        const ratio = w / h
        const radFov = fov * Math.PI / 360
        const getRect = (pz: number) => {
            const rh = Math.tan(radFov) * (pz - z)
            const rw = rh * ratio
            return [
                x - rw, y - rh,
                x + rw, y + rh
            ]
        }

        return orderedRenderInfoList.filter(({ drawable, z, transform }: RenderInfo) => {
            if (drawable.type === 'text') {
                return true
            }

            const {e, f} = transform
            let rect1, rect2 = getRect(z)
            if (drawable.type === 'image') {
                const { x: _x, y: _y, w, h } = drawable
                const x = _x + e
                const y = _y + f
                rect1 = [
                    x, y, x + w, y + h
                ]
            } else {
                rect1 = this.getPathRect(drawable.points, [e, f])
            }

            return this.intersected(
                //@ts-ignore
                ...rect1,
                ...rect2
            )
        })
    }

    private getPathRect(points: Point[], offset: Point) {
        const p1 = points[0]
        let l = p1[0], t = p1[1], r = p1[0], b = p1[1]
        points.slice(1).forEach(p => {
            l = Math.min(l, p[0])
            t = Math.min(t, p[1])
            r = Math.max(l, p[0])
            b = Math.max(t, p[1])
        })

        const [e, f] = offset

        return [
            l + e, t + f, r + e, b + f
        ]
    }

    private intersected(
        x1: number, y1: number, x2: number, y2: number,
        x3: number, y3: number, x4: number, y4: number
    ) {
        return x2 <= x3 || x1 >= x4 || y1 <= y3 || y2 >= y4
    }

    cameraSpace(): DOMMatrix {
        return this.camera!.originToCenter()
            .multiply(
                this.camera!.lookAt()
            )
    }

    toCameraSpace(renderInfo: RenderInfo[]): RenderInfo[] {
        const cam = this.cameraSpace()
        renderInfo.forEach(info => {
            info.transform = cam.multiply(info.transform)
        })
        return renderInfo
    }

    renderCoordinate(renderInfo: RenderInfo[], ctx: CanvasRenderingContext2D) {
        ctx.save()
        for (const {transform, debug} of renderInfo) {
            if(!debug)
                continue
            ctx.setTransform(transform)
            ctx.beginPath()
            ctx.lineTo(10, 0)
            ctx.closePath()
            ctx.strokeStyle = 'red'
            ctx.stroke()

            ctx.beginPath()
            ctx.lineTo(0, 10)
            ctx.closePath()
            ctx.strokeStyle = 'blue'
            ctx.stroke()
            ctx.resetTransform()
        }
        ctx.restore()
    }

    renderLevel(tick: () => void): void {
        this.traverse(this.Root, node => node.componentManager.updateComponents(this))
        let renderInfoList = this.toCameraSpace(this.renderInfoList.splice(0, this.renderInfoList.length))
        renderInfoList = this.culling(renderInfoList)

        renderInfoList.forEach(({ drawable, transform }) => this.painter?.paint(drawable, transform))
        tick()
    }
}

export interface RenderInfo {
    drawable: IDrawable
    transform: DOMMatrix
    z: number
    alpha: number
    debug: boolean
}