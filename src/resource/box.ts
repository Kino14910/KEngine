export interface box<T> {
    unbox(): T
}

export function box<T>(v: T): box<T> {
    if (v === undefined || v === null || typeof v === 'function') {
        throw Error('Invalid.')
    }

    return {
        unbox() {
            return v
        },
    }
}

export function unbox<T extends any>(box: box<T>): T {
    const getter = box.unbox
    if (typeof getter === 'function') {
        return getter()
    }

    if (getter === undefined || getter === null) {
        throw Error('Undefined and null are invalid.')
    }

    return getter
}