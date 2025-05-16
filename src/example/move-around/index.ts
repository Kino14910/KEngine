import { ApplicationBase, ApplicationConfig, Config, IApplicationConfig, MainApplication } from "../../arch/reflect.js"
import { MainGame } from "./prefabs/mainGame.js"

@Config()
export class MyConfig extends ApplicationConfig {
    constructor() {
        super()

        this.renderer.canvasSelector = '#canvas'
    }
}

@MainApplication()
export class MyGame extends ApplicationBase<MyConfig> {
    destroy(): void {}

    start(): void {
        this.level.loadPrefab(MainGame)
    }
}