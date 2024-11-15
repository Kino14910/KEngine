import { RenderScheduler } from "./renderer";

interface Factory<Arg extends unknown[], Ret> {
    produce(...args: Arg): Ret
}

interface RenderSchedulerProduct {
    scheduler: RenderScheduler
    stop: () => void
}

type SchedulerType = 'rAF' | 'timer'

interface IRenderSchedulerFactory extends Factory<
    [ SchedulerType, RenderScheduler, number ],
    RenderSchedulerProduct
> {}

export class RenderSchedulerFactory implements IRenderSchedulerFactory {
    produce(type: SchedulerType, tick: RenderScheduler, interval?: number): RenderSchedulerProduct {
        if(type === 'rAF') {
            let stopped = false

            const scheduler = (execute: () => void) => requestAnimationFrame(()=>{
                if (stopped) {
                    return
                }

                tick(execute)
                scheduler(execute)
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
                    tick(execute)
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

export const renderSchedulerFactory = new RenderSchedulerFactory()