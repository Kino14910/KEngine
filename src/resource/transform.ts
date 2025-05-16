export interface ITransfromer<From, To> {
    (v: From): Promise<To>
}