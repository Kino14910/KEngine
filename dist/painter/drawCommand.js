export class DrawReceiver {
    cmds = new Set();
    execute() {
        this.cmds.forEach(cmd => cmd());
    }
    receive(cmd) {
        this.cmds.add(cmd);
    }
}
