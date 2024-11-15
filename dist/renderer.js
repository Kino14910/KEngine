export class Renderer {
    receiver;
    scheduler;
    ctx;
    constructor(canvas, receiver, scheduler, scale = 2) {
        this.receiver = receiver;
        this.scheduler = scheduler;
        canvas.width *= scale;
        canvas.height *= scale;
        this.ctx = canvas.getContext("2d");
        this.ctx.scale(scale, scale);
        this.init();
    }
    init() {
        this.scheduler(() => this.receiver.execute());
    }
    render(cmdFactory) {
        this.receiver.receive(cmdFactory(this.ctx));
    }
}
