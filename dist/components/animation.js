export class Animation2D {
    frames;
    duration;
    constructor(frames, duration) {
        this.frames = frames;
        this.duration = duration;
    }
    static fromUV(w, h, u, v, ew, eh, count) {
        const frames = {};
        //纵向精灵图
        if (w === ew)
            [w, h, u, v, ew, eh] = [h, w, v, u, eh, ew];
        //横向精灵图
        let lineCount = Math.floor(w / ew);
        while (count >= lineCount) {
            console.log(count);
            for (let i = 0; i < lineCount; i++) {
                console.log(i);
                frames[i] = {
                    sx: u + ew * i,
                    sy: v,
                    sw: ew - 2 * u,
                    sh: eh - 2 * v,
                };
            }
            lineCount *= 2;
            h += eh;
            console.table(frames);
        }
        return frames;
    }
}
