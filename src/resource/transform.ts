export interface ITransfromer<From, To> {
    transform(v: From): Promise<To>
}