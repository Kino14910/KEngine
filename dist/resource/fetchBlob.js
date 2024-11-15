export class FetchBlobTransformer {
    async transform(v) {
        const res = await fetch(v);
        return await res.blob();
    }
}
export const fetchBlobTransformer = new FetchBlobTransformer();
