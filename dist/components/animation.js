export class Animation2D {
    frames;
    duration;
    constructor(frames, duration) {
        this.frames = frames;
        this.duration = duration;
    }
    static fromUV(w, h, u, v, ew, eh, count, duration) {
        const frames = {};
        const durationPerFrame = duration / count;
        //纵向精灵图
        if (w === ew)
            [w, h, u, v, ew, eh] = [h, w, v, u, eh, ew];
        //横向精灵图
        let countPerLine = Math.floor(w / ew);
        let lineCount = Math.ceil(count / countPerLine);
        for (let line = 0; line < lineCount; line++) {
            for (let i = 0; i < countPerLine; i++) {
                const index = line * countPerLine + i;
                if (index >= count)
                    break;
                frames[index * durationPerFrame] = {
                    sx: u + ew * i,
                    sy: v + eh * line,
                    sw: ew,
                    sh: eh,
                };
            }
            console.table(frames);
        }
        return new ConcreteAnimation2D(frames, duration);
    }
}
class ConcreteAnimation2D extends Animation2D {
    frames;
    duration;
    // 还没实现
    update() {
        return 1;
    }
    constructor(frames, duration) {
        super(frames, duration);
        this.frames = frames;
        this.duration = duration;
    }
}
