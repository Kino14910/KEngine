import { Scheduler } from "./renderer"

interface Factory<Arg extends unknown[], Ret> {
    produce(...args: Arg): Ret
}

interface SchedulerProduct {
    scheduler: Scheduler
    stop: () => void
}

type SchedulerType = 'rAF' | 'timer'

interface ISchedulerFactory extends Factory<
    [ SchedulerType, Scheduler, number ],
    SchedulerProduct
> {}

export class SchedulerFactory implements ISchedulerFactory {
    produce(type: SchedulerType, tickExecutor: Scheduler, interval?: number): SchedulerProduct {
        if(type === 'rAF') {
            let stopped = false

            const scheduler = (tick: () => void) => requestAnimationFrame(() => {
                if (stopped) {
                    return
                }

                tickExecutor(tick)
                scheduler(tick)
            })

            const stop = () => {
                stopped = true
            }

            return {
                scheduler, stop
            }
        }

        if(type === 'timer') {
            let timer: number
            const scheduler = (execute: () => void ) => {
                timer = setInterval(() => {
                    tickExecutor(execute)
                }, interval) as unknown as number
            }
            const stop = () => {
                clearInterval(timer)
            }
            return {
                scheduler,
                stop
            }
        }

        return this.produce('rAF', fn => fn())
    }
    
}

export const schedulerFactory = new SchedulerFactory()