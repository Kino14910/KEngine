import { type box } from "./box.js"
import { ITransfromer } from "./transform.js"

export interface Resource<T> extends box<T> {
    read(): Promise<T>
    release(): void
}

export abstract class Res<T> implements Resource<T> {
    abstract unbox(): T
    abstract read(): Promise<T>
    abstract release(): Promise<void> | void
    static from<S, D>(source: S, transformer: ITransfromer<S, D>): Promise<D> {
        return transformer(source)
    }
}

export interface ResourceMutable<F, T> extends Resource<T> {
    update(value: F): void
}

export abstract class ResMut<F, T> implements ResourceMutable<F, T> {
    abstract unbox(): T
    abstract update(value: F): void
    abstract read(): Promise<T>
    abstract release(): void
    static from<S, D>(source: S, transformer: ITransfromer<S, D>): Promise<D> {
        return transformer(source)
    }
}