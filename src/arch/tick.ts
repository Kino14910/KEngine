import { Scheduler } from "../renderer/renderer.js"
import { Component } from "./component.js"
import { Level } from "./level.js"

export class TickComponent extends Component {
    triggerTick(dt: number, level: Level) {
        this.getComponentManager()
            .tick(dt, level)
    }
}

export interface ITickSystemManager {
    addTickSystem(tickSystem: TickSystem): void
    removeTickSystem(tickSystem: TickSystem): void
}

export class TickSystem {
    private tickComponents = new Set<TickComponent>()

    constructor(
        /**
         * 使用 {@link schedulerFactory} 创建 Scheduler 实例
         * ```
         * // 50ms 间隔执行一次
         * schedulerFactory.produce('timer', tick => tick(), 50)
         * ```
         */
        readonly scheduler: Scheduler,
        readonly cancelScheduler: () => void,
        readonly level: Level,
    ) {}

    public dilation = 1

    createTickComponent() {
        const tickComponent = new TickComponent()
        this.tickComponents.add(tickComponent)
        return tickComponent
    }

    private _lastTickTime = 0

    doTick = () => {
        const now = Date.now()
        const dt = (now - this._lastTickTime) / 1000 * this.dilation
        this._lastTickTime = now
        this.tickComponents.forEach(tickComponent => {
            tickComponent.getComponentManager().tick(dt, this.level)
        })
    }

    start() {
        this.scheduler(this.doTick)
    }

    stop() {
        this.cancelScheduler()
    }
}
