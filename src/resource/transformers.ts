import { ITransfromer } from "./transform"

export const fetchBlobTransformer: ITransfromer<string, Blob> = async (v: string) => {
    const res = await fetch(v)

    return await res.blob()
}

export const fetchObjectTransformer: ITransfromer<string, object> = async (v: string) => {
    const res = await fetch(v)

    return JSON.parse(await res.text())
}