import { ComponentManager } from "./component.js";
export class KNode {
    id;
    parent;
    componentManager;
    childNodes;
    constructor(id, parent, componentManager = new ComponentManager(), childNodes = []) {
        this.id = id;
        this.parent = parent;
        this.componentManager = componentManager;
        this.childNodes = childNodes;
    }
    getComponent(ctor) {
        return this.componentManager.get(ctor);
    }
    addComponent(...component) {
        this.componentManager.add(this, ...component);
        return component;
    }
}
export var InsertPosition;
(function (InsertPosition) {
    InsertPosition[InsertPosition["Child"] = 0] = "Child";
    InsertPosition[InsertPosition["Before"] = 1] = "Before";
    InsertPosition[InsertPosition["After"] = 2] = "After";
})(InsertPosition || (InsertPosition = {}));
