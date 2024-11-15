export var CollisionResult;
(function (CollisionResult) {
    CollisionResult[CollisionResult["None"] = 0] = "None";
    CollisionResult[CollisionResult["Top"] = 1] = "Top";
    CollisionResult[CollisionResult["Left"] = 2] = "Left";
    CollisionResult[CollisionResult["Right"] = 4] = "Right";
    CollisionResult[CollisionResult["Bottom"] = 8] = "Bottom";
    CollisionResult[CollisionResult["Inside"] = 16] = "Inside";
})(CollisionResult || (CollisionResult = {}));
export function testAabb(target, origin) {
    const { x: x1, y: y1, w: w1, h: h1 } = target;
    const { x: x2, y: y2, w: w2, h: h2 } = origin;
    const ax1 = x1 + w1;
    const ay1 = y1 + h1;
    const ax2 = x2 + w2;
    const ay2 = y2 + h2;
    if (x1 > ax2 || y1 > ay2 || x2 > ax1 || y2 > ay1) {
        return false;
    }
    return true;
}
export function collideAabb(target, origin) {
    const { x: x1, y: y1, w: w1, h: h1 } = target;
    const { x: x2, y: y2, w: w2, h: h2 } = origin;
    const ax1 = x1 + w1;
    const ay1 = y1 + h1;
    const ax2 = x2 + w2;
    const ay2 = y2 + h2;
    if (x1 > ax2 || y1 > ay2 || x2 > ax1 || y2 > ay1) {
        return CollisionResult.None;
    }
    let collideResult = 0;
    if (x1 <= x2) {
        collideResult |= CollisionResult.Left;
    }
    if (y1 <= y2) {
        collideResult |= CollisionResult.Top;
    }
    if (ax1 >= ax2) {
        collideResult |= CollisionResult.Right;
    }
    if (ay1 >= ay2) {
        collideResult |= CollisionResult.Bottom;
    }
    if (collideResult === 0) {
        collideResult |= CollisionResult.Inside;
    }
    return collideResult;
}
