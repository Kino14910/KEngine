import { Vec2 } from "../stl/vec2.js";
export class Input {
    static keyPressing = new Set();
    static buttonsPressing = 0;
    static axis = Vec2.zero();
    static customInputs = new Map();
    static mousePosition = [0, 0];
    static isKeyPressing(key) {
        return this.keyPressing.has(key);
    }
    static isButtonPressing(...buttons) {
        for (const btn of buttons) {
            const flag = 1 << btn;
            if (!(flag & this.buttonsPressing))
                return false;
        }
        return true;
    }
    static setInupt(type, value) {
        this.customInputs.set(type, value);
    }
    static getInput(type) {
        return this.customInputs.get(type);
    }
    static registerInput() {
        window.addEventListener('keydown', e => this.keyPressing.add(e.code));
        window.addEventListener('keyup', e => this.keyPressing.delete(e.code));
        window.addEventListener('mousedown', e => this.buttonsPressing = e.buttons);
        window.addEventListener('mouseup', e => this.buttonsPressing = e.buttons);
        window.addEventListener('mousemove', e => {
            this.mousePosition[0] = e.screenX;
            this.mousePosition[1] = e.screenY;
        });
    }
}
export var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Right"] = 1] = "Right";
    MouseButton[MouseButton["Middle"] = 2] = "Middle";
    MouseButton[MouseButton["Button4"] = 3] = "Button4";
    MouseButton[MouseButton["Button5"] = 4] = "Button5";
})(MouseButton || (MouseButton = {}));
