export function constructorOf(inst) {
    //@ts-ignore
    return Reflect.getPrototypeOf(inst).constructor;
}
export class ComponentManager {
    static MANAGER_TAG = Symbol('COMPONENT_MANAGER');
    static NODE_TAG = Symbol('NODE_TAG');
    components = new Map();
    get(ctor) {
        return this.components.get(ctor)
            ?? new Set();
    }
    add(node, ...component) {
        for (const comp of component) {
            //@ts-ignore
            if (!comp[ComponentManager.MANAGER_TAG]) {
                //@ts-ignore
                comp[ComponentManager.MANAGER_TAG] = this;
                //@ts-ignore
                comp[ComponentManager.NODE_TAG] = node;
                comp.start();
            }
            const ctor = constructorOf(comp);
            let componentSet = this.components.get(ctor);
            if (componentSet) {
                componentSet.add(comp);
                continue;
            }
            componentSet = new Set();
            componentSet.add(comp);
            this.components.set(ctor, componentSet);
        }
    }
    clear() {
        this.components.forEach(v => v.clear());
        this.components.clear();
    }
    updateComponents(lvl) {
        this.components.forEach(v => v.forEach(c => c.update(lvl)));
    }
}
export class Component {
    getNode() {
        //@ts-ignore
        return this[ComponentManager.NODE_TAG];
    }
    getComponentManager() {
        //@ts-ignore
        return this[ComponentManager.MANAGER_TAG];
    }
    getAncestorComponents(ctor, toAncestor) {
        const result = [];
        let self = this.getNode().parent;
        if (!self) {
            return result;
        }
        while (self !== toAncestor && self.parent) {
            result.unshift(Array.from(self.componentManager.get(ctor)));
            self = self.parent;
        }
        return result;
    }
}
