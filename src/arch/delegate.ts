export class Delegate<TArgs extends [] = []> {
    private _callbacks: ((...args: TArgs) => void)[] = [];

    add(fn: (...args: TArgs) => void) {
        this._callbacks.push(fn);
    }

    exec(...args: TArgs) {
        this._callbacks.forEach(fn => fn(...args));
    }
}