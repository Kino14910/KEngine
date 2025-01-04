import { Level } from "../../arch/level.js"
import { renderSchedulerFactory } from "../../renderer/schedular.js"
import { BackgroundPrefab } from "./prefabs/background.js"
import { PlayerPrefab } from "./prefabs/player.js"

const lvl = new Level()
const { scheduler } = renderSchedulerFactory.produce('rAF', renderOnce => lvl.renderLevel(renderOnce))

lvl.createPainter(
    document.querySelector('#canvas') as HTMLCanvasElement,
    scheduler,
    true
)

await Promise.all([
    lvl.loadPrefab(BackgroundPrefab),
    lvl.loadPrefab(PlayerPrefab),
])

lvl.start()