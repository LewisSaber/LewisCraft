import GUIComponent from "./GUIComponent.js"

export class Label extends GUIComponent {
    constructor() {
        super()
        this.text = ""
        this.fontSize = 1
        this.color = "black"
    }
    setColor(color) {
        this.color = color
        if (this.isBuilt)
            this.loadValues()
        return this
    }
    setText(text) {
        this.text = text
        if (this.isBuilt)
            this.loadValues()
        return this
    }
    createContainer() {
        this.container = document.createElement("div")
        this.container.style.position = "absolute"
        this.container.style.fontFamily = "Minecraftia"

    }
    setFontSize(fontSize) {
        this.fontSize = fontSize
        if (this.isBuilt)
            this.resize()
        return this
    }
    loadValues() {
        this.container.innerHTML = this.text
        this.container.style.color = this.color

    }
    resize() {
        let pixelSize = this.getPixelSize()
        this.container.setPosition(this.position.multiply(pixelSize))
        this.container.style.fontSize = this.fontSize * (pixelSize.x)
    }
    build() {
        this.createContainer()
        this.loadValues()

        this.isBuilt = true
        return this
    }
}
