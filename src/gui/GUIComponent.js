import { Vector } from "./../math.js"

export default class GUIComponent {
    constructor() {
        this.size = new Vector()
        this.isBuilt = false
        this.position = new Vector()
        this.z_layer_parental = 0
        this.z_layer_additional = 0

    }
    setPosition(x, y) {
        this.position = new Vector(x, y)
        return this
    }
    setParentalZLayer(layer) {
        this.z_layer_parental = layer
        if (this.isBuilt) {
            this.applyZlayer()
        }
        return this
    }
    setZLayer(layer) {
        this.z_layer_additional = layer
        if (this.isBuilt) {
            this.applyZlayer()
        }
        return this

    }
    getZLayer() {
        return this.z_layer_parental + this.z_layer_additional
    }
    applyZlayer() {
        this.getContainer().setZLayer(this.z_layer_parental + this.z_layer_additional)
        return this
    }
    getPixelSize() {
        return this.pixelSize || this.parent.getPixelSize()
    }
    setSize(x, y) {

        this.size = new Vector(x, y)
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
    createContainer() { }

    getContainer() {
        return this.container
    }
    setBackground(img) {
        this.backgroundImg = img
        if (this.isBuilt)
            this.applyBackground()
    }
    applyBackground() {
        this.getContainer().setBackgroundImage(this.backgroundImg)
        return this
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
    build() {
        this.createContainer()
        this.applyZlayer()
    }
}