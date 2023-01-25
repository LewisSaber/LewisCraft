import { Vector } from "./../math.js"

export default class GUIComponent {
    constructor() {
        this.size = new Vector()
        this.isBuilt = false
        this.position = new Vector()
    }
    setPosition(position) {
        this.position = position
        return this
    }
    getPixelSize() {
        return this.pixelSize || this.parent.getPixelSize()
    }
    setSize(vector) {
        if (vector.hasZeroAxis()) {
            console.error("cant create container with size", vector.toString())
            return
        }
        this.size = vector
        return this
    }
    setWidth(width) {
        if (width == 0) {
            console.error("cant set 0 width")
            return
        }
        this.size.x = width
        return this
    }
    setParent(parent) {
        this.parent = parent
        return this
    }
    setHeight(height) {
        if (height == 0) {
            console.error("cant set 0 height")
            return
        }
        this.size.y = height
        return this
    }

    getContainer() {
        return this.container
    }
    setDecoration(decoration) {
        if (this[`decoration${decoration}`] == undefined) {
            console.warn("no decoration found with id", decoration, ". Setting decoration to 0")
            decoration = 0
        }
        this.decoration = decoration
        return this
    }
    applyDecoration() {
        this.container.applyStyle(this[`decoration${this.decoration}`](this.size.multiply(this.getPixelSize())))
    }
    resize() { }
    build() { }
}