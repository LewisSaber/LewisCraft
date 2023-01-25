import GUIComponent from "./GUIComponent.js"

export class Button extends GUIComponent {
    constructor() {
        super()
        this.actions = {}
        this.decoration = 0
        this.text = ""
        this.fontSize = 1
    }
    setFontSize(fontSize) {
        this.fontSize = fontSize
        if (this.isBuilt)
            this.resize()
        return this
    }

    decoration0(size) {
        return {
            border: `inset min(${size.x * 0.05}px,${size.y * 0.05}px) #5f5f5f`,

        }
    }
    decoration1(size) {
        return {
            'border-right': `${size.y * 0.05}px solid #000000`,
            'border-bottom': `${size.y * 0.05}px solid #000000`,
            'background': 'none'

        }
    }
    setText(text) {

        this.text = text
        if (this.isBuilt)
            this.applyValues()
        return this
    }

    addAction(func, button = "left") {
        this.actions[button] = func
        return this
    }
    resize() {
        let pixelSize = this.getPixelSize()
        this.container.style.fontSize = this.fontSize * (pixelSize.x)
        this.applyDecoration(this.size.multiply(pixelSize))
        this.container.setSize(this.size.multiply(pixelSize))
        this.container.setPosition(this.position.multiply(pixelSize))
    }
    createContainer() {
        this.container = document.createElement("button")
        this.container.style.pointerEvents = "all"
        this.container.style.position = "absolute"
        this.container.style.backgroundSize = "100% 100%"
        this.container.style.imageRendering = "Pixelated"
        this.container.style.fontFamily = "Minecraftia"
        this.container.disableContextMenu()

    }
    setIcon(icon) {
        this.icon = icon
        if (this.isBuilt)
            this.applyValues()
        return this
    }
    handleClick(evt) {
        switch (evt.button) {
            case 0:
                if (this.actions.left)
                    this.actions.left()
                break;
            case 1:
                if (this.actions.right)
                    this.actions.right()
                break;
        }
    }
    applyValues() {

        if (this.icon) {
            this.container.setBackgroundImage(this.icon)
        }
        this.container.innerHTML = this.text
    }

    bindActionToContainer() {
        this.container.onmousedown = (evt) => { this.handleClick(evt) }
    }
    build() {
        this.createContainer()
        this.applyValues()
        this.bindActionToContainer()
        this.isBuilt = true
        return this
    }

}