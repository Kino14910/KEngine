export class RenderSchedulerFactory {
    produce(type, tick, interval) {
        if (type === 'rAF') {
            let stopped = false;
            const scheduler = (execute) => requestAnimationFrame(() => {
                if (stopped) {
                    return;
                }
                tick(execute);
                scheduler(execute);
            });
            const stop = () => {
                stopped = true;
            };
            return {
                scheduler, stop
            };
        }
        if (type === 'timer') {
            let timer;
            const scheduler = (execute) => {
                timer = setInterval(() => {
                    tick(execute);
                }, interval);
            };
            const stop = () => {
                clearInterval(timer);
            };
            return {
                scheduler,
                stop
            };
        }
        return this.produce('rAF', fn => fn());
    }
}
export const renderSchedulerFactory = new RenderSchedulerFactory();
