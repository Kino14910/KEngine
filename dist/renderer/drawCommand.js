import { LinkedList } from "../stl/linkedList.js";
export class DrawReceiver {
    cmds = new LinkedList();
    execute() {
        for (const cmd of this.cmds) {
            cmd();
        }
        this.cmds.clear();
    }
    receive(cmd) {
        this.cmds.append(cmd);
    }
}
export const clearCommand = ({ x, y, w, h } = {
    x: 0, y: 0, w: 0, h: 0
}) => {
    return ctx => () => {
        ctx.save();
        ctx.clearRect(x, y, w, h);
        ctx.beginPath();
        ctx.restore();
    };
};
