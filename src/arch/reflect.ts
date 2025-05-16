import { IRenderer, Renderer2D } from "../renderer/renderer.js"
import { schedulerFactory } from "../renderer/schedular.js"
import { Res } from "../resource/res.js"
import { fetchObjectTransformer } from "../resource/transformers.js"
import { Vec2 } from "../stl/vec2.js"
import { ConstructorOf } from "./component.js"
import { ClientInput } from "./input.js"
import { Level } from "./level.js"
import { IViewport, Viewport } from "./viewport.js"

let application: IApplication<IApplicationConfig> | null = null
const applications = new Map<string, IApplication<IApplicationConfig>>()

export interface ApplicationWindowConfig {
    width: number
    height: number
}

export interface ApplicationRendererConfig {
    canvasSelector: string
    type: '2d' | '3d',
    scheduler: {
        type: 'rAF' | 'fixed'
        fps: number
    },
    pixelArt: boolean
}

export interface IApplicationConfig {
    window: ApplicationWindowConfig
    renderer: ApplicationRendererConfig
}

export class ApplicationConfig implements IApplicationConfig {
    renderer: ApplicationRendererConfig = {
        canvasSelector: 'canvas',
        scheduler: {
            type: 'rAF',
            fps: 60,
        },
        type: '2d',
        pixelArt: true,
    }
    window: ApplicationWindowConfig = {
        width: 1920,
        height: 1080,
    }
}

export function getCurrentApplication<T extends IApplication<Conf>, Conf extends IApplicationConfig>() {
    return application as T
}

export function getApplication<T extends IApplication<Conf>, Conf extends IApplicationConfig>(applicationId: string) {
    return applications.get(applicationId) as T | null
}

export function createApplication(applicationId: string, appClass: ConstructorOf<IApplication<any>>) {
    if (applications.has(applicationId)) {
        return applications.get(applicationId) as IApplication<any>
    }

    const userApp = Reflect.construct(appClass, [])
    userApp.getApplicationId = () => applicationId
    applications.set(applicationId, userApp)

    return userApp
}

export function startApplication(applicationId: string, appClass: ConstructorOf<IApplication<any>>) {
    if (application) {
        application.destroy()
    }

    const app = createApplication(applicationId, appClass)
    app.start()
    application = app
}

export function destroyApplication(applicationId: string) {
    const application = applications.get(applicationId)
    if (application) {
        application.destroy()
        applications.delete(applicationId)
    }
}

export class ApplicationConfigHelper {
    private static readonly applicationMetaMapping = new Map<string, any>()
    static readonly defaultConfig: IApplicationConfig = new ApplicationConfig()

    static getConfig(applicationId: string) {
        return this.applicationMetaMapping.get(applicationId)
    }

    static getConfigOrElse<T extends IApplicationConfig>(
        applicationId: string,
        orElse: any=ApplicationConfigHelper.defaultConfig
    ): T {
        return this.applicationMetaMapping.get(applicationId) || orElse
    }

    static setConfig(applicationId: string, meta: any) {
        this.applicationMetaMapping.set(applicationId, meta)
    }
}

export const Config = (applicationId: string='default') => (metaClass: ConstructorOf<any>) => {
    ApplicationConfigHelper.setConfig(applicationId, Reflect.construct(metaClass, []))
}

export const InjectConfig = (applicationId: string='default', assetPath: string) => (metaClass: ConstructorOf<any>) => {
    Res.from(assetPath, fetchObjectTransformer).then(conf => {
        const meta = Reflect.construct(metaClass, [conf])
        ApplicationConfigHelper.setConfig(applicationId, Object.assign(meta, conf))
    })
}

export interface IWindowManager {
    getRenderer(): IRenderer<unknown, unknown>
    getWindowSize(): Vec2
    getViewport(): IViewport
}

export interface ILevelManager {
    getLevel(): Level
}

export interface IApplication<TConf extends IApplicationConfig>extends IWindowManager, ILevelManager {
    start(): void
    destroy(): void
    getConfig(): TConf
    getApplicationId(): string
}

export const Application = (applicationId: string='default') => (target: ConstructorOf<IApplication<any>>) => {
    createApplication(applicationId, target)
}

let mainApplicationCount = 0

export const MainApplication = (applicationId: string='default') => (target: ConstructorOf<IApplication<any>>) => {
    if (mainApplicationCount > 1) {
        throw new Error('main application can only be one')
    }

    startApplication(applicationId, target)
    mainApplicationCount++

    ClientInput.registerInputs()
}

export abstract class ApplicationBase<TConf extends IApplicationConfig> implements IApplication<TConf> {
    readonly viewport: IViewport = new Viewport()
    readonly level = new Level()

    /**
     * virtual method
     * implement in {@link createApplication}
     */
    getApplicationId(): any {}

    getConfig(): TConf {
        return ApplicationConfigHelper.getConfigOrElse(this.getApplicationId())
    }

    getWindowSize(): Vec2 {
        const { width, height } = this.getConfig().window
        return new Vec2(width, height)
    }

    getViewport(): IViewport {
        return this.viewport
    }

    getLevel(): Level {
        return this.level
    }

    abstract start(): void
    abstract destroy(): void

    private renderer: IRenderer<unknown, unknown> | null = null
    private stopRenderer: () => void = Function.prototype as any

    constructor() {
        this.getRenderer()
    }

    getRenderer(): IRenderer<unknown, unknown> {
        if (this.renderer) {
            return this.renderer
        }

        const { type, scheduler, canvasSelector, pixelArt } = this.getConfig().renderer
        const { scheduler: schedulerFn, stop } = schedulerFactory.produce(scheduler.type, exec => this.level.updateLevel(exec), scheduler.fps)

        this.stopRenderer = stop

        if (type === '2d') {
            return this.renderer = new Renderer2D(
                document.querySelector(canvasSelector) as HTMLCanvasElement,
                schedulerFn,
                pixelArt
            )
        }

        throw new Error('unknown renderer type')
    }
}