export class Renderer {
    receiver;
    scheduler;
    static instance;
    ctx;
    constructor(canvas, receiver, scheduler) {
        this.receiver = receiver;
        this.scheduler = scheduler;
        this.ctx = canvas.getContext("2d");
        this.init();
        Renderer.instance = this;
    }
    init() {
        this.scheduler(() => this.receiver.execute());
    }
    render(cmdFactory) {
        this.receiver.receive(cmdFactory(this.ctx));
    }
}
