export interface box<T> {}

const valueOf = Symbol()
//@ts-ignore
export function box<T>(v: T): box<T> {
    if (v === undefined || v === null || typeof v === 'function') {
        throw Error('Invalid.')
    }

    //@ts-ignore
    v[valueOf] = v
}

export function unbox<T>(box: box<T>): T {
    //@ts-ignore
    const getter = box[valueOf]
    if (typeof getter === 'function') {
        return getter()
    }

    if (getter === undefined || getter === null) {
        throw Error('Undefined and null are invalid.')
    }

    return getter
}

box.value = valueOf