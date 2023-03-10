import Gui from "./Gui.js"


export class Label extends Gui {
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
    centerText() {
        this.textCentered = true
        return this
    }
    createContainer() {
        this.container = document.createElement("div")
        if (this.textCentered)
            this.container.style.textAlign = "center"
        this.container.style.pointerEvents = "none"
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
        super.resize()
        let pixelSize = this.getPixelSize()
        this.container.style.fontSize = this.fontSize * (pixelSize.x)
    }
    build() {
        this.setParentSize()
        super.build()
        this.loadValues()

        this.isBuilt = true
        return this
    }
}
