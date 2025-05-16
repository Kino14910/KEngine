import { Component } from "../arch/component.js"

export class Transform extends Component {
    constructor(
        public local: DOMMatrix = new DOMMatrix(),
    ) {
        super()
    }
}