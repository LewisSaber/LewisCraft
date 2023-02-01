import { Vector } from "../math.js"
import { BackGround } from "./background.js"
import Gui from "./Gui.js"
import { Label } from "./Label.js"


export class Button extends Gui {
    constructor() {
        super()
        this.actions = {}
        this.decoration = 0
        this.text = ""
        this.fontSize = 1
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
    decorationNO() {
        return {
            'background-color': 'transparent'
        }
    }
    setText(text, fontSize = this.fontSize, color = "black", x = 0, y = 0) {
        if (!this.textLabel) {
            this.textLabel = new Label()
        }
        this.textLabel = new Label().setText(text).setColor(color).setFontSize(this.fontSize)
        if (this.textLabel.position.x != x || this.textLabel.position.y != y)
            this.textLabel.setPosition(x, y)
        return this
    }

    addAction(func, button = "left") {
        this.actions[button] = func
        return this
    }

    createContainer() {
        this.container = document.createElement("button")
        this.container.style.pointerEvents = "all"
        this.container.style.position = "absolute"
        this.container.style.backgroundSize = "100% 100%"
        this.container.style.imageRendering = "Pixelated"
        this.container.style.fontFamily = "Minecraftia"
        this.container.disableContextMenu()
        return this
    }
    setIcon(icon, x = 0.15, y = 0.15, width = -1, height = -1) {
        if (width == -1) {

            width = this.size.x - 2 * x

        }
        if (height == -1) {
            height = this.size.y - 2 * y
        }

        if (height < width) {
            width = height
        }
        else
            height = width
        console.log(x, y, height, width)
        let icon_component = new BackGround().setSize(width, height).setPosition(x, y).setName("icon").setBackGround(icon)
        this.addComponent(icon_component)
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


    bindActionToContainer() {
        this.container.onmousedown = (evt) => { this.handleClick(evt) }
    }
    build() {
        super.build()
        this.bindActionToContainer()
        this.isBuilt = true
        return this
    }

}