interface MatchResult<T, V> {
    matched: Tuple2Union<T>
    value: V
}

export interface MatchTrait<Traits extends readonly string[] = string[], V = any> {
    get traits(): Traits
    match(): MatchResult<Traits, V>
}

export type Tuple2Union<T> = T extends readonly [ infer First, ...infer Rest ]
    ? First | Tuple2Union<Rest>
    : never

export type Nonull<T> = Exclude<T, null | undefined>

export class Option<T> implements MatchTrait<readonly ['Some', 'None'], T> {
    get traits() {
        return [ 'Some', 'None' ] as const
    }

    constructor(
        private _value?: T   
    ) {}

    match(): MatchResult<readonly ["Some", "None"], T> {
        return {
            matched: this._value === undefined || this._value === null ? 'None' : 'Some',
            value: this._value as T
        }
    }

    static Some<T>(v: T): Option<Nonull<T>> {
        return new Option(v) as any
    }

    static None<T>(): Option<Nonull<T>> {
        return new Option()
    }
}

function checkArms(arms: any[]) {
    if (arms.length % 2) {
        throw Error('The pattern matching arm is invalid.')
    }
}

function checkFn(fn: any): Function {
    if (!fn.apply) {
        throw Error('The pattern matching function is invalid.')
    }

    return fn
}

const invalidPatternError = () => {
    throw Error('The pattern matching pattern is invalid.')
}

type MatchPattern<T> = T | '_'
type MatchArm<P, Fn> =
    | [MatchPattern<P>, Fn, MatchPattern<P>, Fn, MatchPattern<P>, Fn, MatchPattern<P>, Fn, MatchPattern<P>, Fn]
    | [MatchPattern<P>, Fn, MatchPattern<P>, Fn, MatchPattern<P>, Fn, MatchPattern<P>, Fn]
    | [MatchPattern<P>, Fn, MatchPattern<P>, Fn, MatchPattern<P>, Fn]
    | [MatchPattern<P>, Fn, MatchPattern<P>, Fn]
    | [MatchPattern<P>, Fn]
    | (MatchPattern<P> | Fn)[]

const wildcardMatchingError = () => {
    throw Error('No exact or wildcard matches were found.')
}

export function match<R>(v: string): (pattern: string, fn: (part: string) => R, ...more: MatchArm<typeof pattern, typeof fn>) => R
export function match<R>(v: string): (pattern: RegExp, fn: (...part: string[]) => R, ...more: MatchArm<typeof pattern, typeof fn>) => R
export function match<R>(v: number): (pattern: number | [number[]], fn: (part: number) => R, ...more: MatchArm<typeof pattern, typeof fn>) => R
export function match<R>(v: number): (pattern: [number|undefined, number|undefined], fn: (part: number) => R, ...more: MatchArm<typeof pattern, typeof fn>) => R
export function match<R, T extends readonly string[], V>(v: MatchTrait<T, V>): (pattern: Tuple2Union<T>, fn: (part: V) => R, ...more: MatchArm<typeof pattern, typeof fn>) => R
export function match(v: any) {
    if (typeof v === 'string') {
        return (...arms: any[]) => {
            checkArms(arms)
            let wildcard: Function = wildcardMatchingError
            const len = arms.length
            for (let i = 0; i < len; i += 2) {
                const pattern = arms[i]
                const fn = checkFn(arms[i + 1])
                if (pattern === '_') {
                    wildcard = fn
                    continue
                }

                if (typeof pattern === 'string' && pattern === v) {
                    return fn.call(null, v)
                }

                if (pattern instanceof RegExp) {
                    const result = pattern.exec(v)
                    if (result) {
                        return fn.apply(null, result)
                    }
                }
            }

            return wildcard.call(null, v)
        }
    }

    if (typeof v === 'number') {
        return (...arms: any[]) => {
            checkArms(arms)
            let wildcard: Function = wildcardMatchingError
            const len = arms.length
            for (let i = 0; i < len; i += 2) {
                const pattern = arms[i]
                const fn = checkFn(arms[i + 1])

                if (typeof pattern === 'number') {
                    if (pattern === v) {
                        return fn.call(null, v)   
                    }
                    continue
                }

                if (!Array.isArray(pattern)) {
                    invalidPatternError()
                }

                const patternExpr = <any[]> pattern
                if (Array.isArray(patternExpr[0]) && patternExpr[0].includes(v)) {
                    return fn.call(null, v)
                }

                const [ greater, less ] = patternExpr
                if (v >= (greater ?? -Infinity) && v < (less ?? Infinity)) {
                    return fn.call(null, v)
                }
            }

            return wildcard.call(null, v)
        }
    }

    const traits = v?.traits
    if (Array.isArray(traits)) {
        return (...arms: any[]) => {
            checkArms(arms)
            const matcher = <MatchTrait> v
            const { matched, value } = matcher.match()
            const i = arms.indexOf(matched)

            if (i === -1) {
                const wildcardIndex = arms.indexOf('_')
                if (wildcardIndex === -1) {
                    wildcardMatchingError()
                }

                const wildcard = checkFn(arms[wildcardIndex + 1])
                return wildcard.call(null)
            }

            const fn = checkFn(arms[i + 1])
            return fn.call(null, value)
        }
    }

    throw Error('The pattern matching arm is invalid.')
}

export function ifLet<R, T extends readonly string[], V>(
    v: MatchTrait<T, V>,
    pattern: Tuple2Union<T>,
    matched: (part: V) => R,
    orElse: () => R = Function.prototype as () => R
): R {
    return match(v) (
        pattern, matched,
        '_', orElse
    ) as R
}