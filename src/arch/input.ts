import { Vec2, Vector2 } from "../stl/vec2.js"

export class ClientInput {
    static keyPressing: Set<string> = new Set()
    static buttonsPressing: number = 0
    static axis: Vector2 = Vec2.zero()
    static customInputs: Map<string, any> = new Map()
    static mousePosition: Vector2 = Vec2.zero()

    private static isRegistered = false
    
    static isKeyPressing(key: string): boolean {
        return this.keyPressing.has(key)
    }

    static isButtonPressing(...buttons: MouseButton[]) {
        for (const btn of buttons) {
            const flag = 1 << btn
            if (!(flag & this.buttonsPressing))
                return false
        }
        return true
    }

    static setInupt<T>(type: string, value: T) {
        this.customInputs.set(type, value)
    }

    static getInput<T>(type: string): T | undefined {
        return this.customInputs.get(type)
    }

    static registerInput(): void {
        if (!this.isRegistered) {
            window.addEventListener('keydown', e => this.keyPressing.add(e.code))
            window.addEventListener('keyup', e => this.keyPressing.delete(e.code))
            window.addEventListener('mousedown', e => this.buttonsPressing = e.buttons)
            window.addEventListener('mouseup', e => this.buttonsPressing = e.buttons)
            window.addEventListener('mousemove', e => {
                this.mousePosition.x = e.screenX
                this.mousePosition.y = e.screenY
            })
            this.isRegistered = true
        }
    }
}

export enum MouseButton {
    Left,
    Right,
    Middle,
    Button4,
    Button5
}