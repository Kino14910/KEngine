import { ITransfromer } from "./transform"

export class FetchBlobTransformer implements ITransfromer<string, Blob> {
    async transform(v: string): Promise<Blob> {
        const res = await fetch(v)

        return await res.blob()
    }
}

export const fetchBlobTransformer = new FetchBlobTransformer()