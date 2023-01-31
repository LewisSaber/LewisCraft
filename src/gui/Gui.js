

import { Vector } from "../math.js"
import { getUniqueIdentificator } from "../utility.js"


export default class Gui {
    constructor(game) {
        this.name = "name"
        this.size = new Vector(-1, -1)
        this.game = game
        this.isOpen = false
        this.position = new Vector()
        this.components = []
        this.backgrounds = []
        this.internalGuis = []
        this.activeGuis = {}
        this.queue = []
        this.z_layer_additional = 0
        this.z_layer_parental = 0

    }
    getName() {
        return this.name
    }
    setName(name) {
        this.name = name
        return this
    }
    setPosition(x, y) {
        this.position = new Vector(x, y)
        return this
    }

    setWidth(width) {
        if (width <= 0) {
            console.error("Wrong width", width)
        }
        this.size.x = width
        return this
    }

    setHeight(height) {
        if (height <= 0) {
            console.error("Wrong width", height)
        }
        this.size.y = height
        return this
    }
    getWindowSize() {
        return new Vector(window.innerWidth, window.innerHeight)
    }
    getChannel() {
        return this.channel
    }
    computeSize() {
        if (this.parent == undefined) {

            let windowSize = this.getWindowSize()
            this.pixelSize = new Vector()
            if (this.size.y == -1) {
                if (this.size.x == -1) {
                    console.error("Gui", this.name, "got 0 vector size")
                    return
                }
                this.pixelSize.x = windowSize.x / this.size.x
                this.pixelSize.y = this.pixelSize.x
                this.size.y = windowSize.y / this.pixelSize.y
            } else
                if (this.size.x == -1) {
                    if (this.size.y == -1) {
                        console.error("Gui", this.name, "got 0 vector size")
                        return
                    }
                    this.pixelSize.y = windowSize.y / this.size.y
                    this.pixelSize.x = this.pixelSize.y
                    this.size.x = windowSize.x / this.pixelSize.x
                } else {
                    this.pixelSize.y = windowSize.y / this.size.y
                    this.pixelSize.x = this.pixelSize.y
                }
        }
        else {

            if (this.size.x == -1)
                this.size.x = this.parent.size.x
            if (this.size.y == -1)
                this.size.y = this.parent.size.y
        }
        return this
        // this.size = windowSize
    }
    createContainer() {
        this.container = document.createElement("div")

        this.container.style.display = "none"
        this.container.style.position = "absolute"
        this.container.style.pointerEvents = "none"
        return this
    }
    attachContainer(container) {
        this.container.appendChild(container)
        return this
    }
    detachContainer(container) {
        this.container.removeChild(container)
    }
    getContainer() {
        return this.container
    }

    build() {
        this.computeSize()
        this.createContainer()
        this.renderBackgrounds()
        this.applyZLayer()
        this.isBuilt = true
        for (let component of this.queue) {
            if (component.component instanceof Gui) {
                this.addGui(component.component, component.options)
            }
            else
                this.addComponent(component.component, component.options)
        }
        delete this.queue
        return this
    }
    open() {
        if (this.parent)
            this.parent.handleGuiOpen(this)

        this.container.style.display = "block"
        this.isOpen = true
        return this
    }
    /**
     * 
     * @param {Background} background 
     * @param {Object} options 
     * @returns 
     */
    addBackground(background, options = {}) {
        background.setParent(this)

        this.backgrounds.push({ background: background, options: options })
        if (this.isBuilt)
            this.renderBackground({ background: background, options: options })
        return this
    }
    renderBackground(background) {

        if (background.options.fromBottom) {

            background.background.position.y = this.size.y - background.background.position.y

        }
        if (background.options.fromRight) {
            background.background.position.x = this.size.x - background.background.position.x

        }
        if (!background.background.isBuilt)
            background.background.build()
        background.background.resize()
        this.attachContainer(background.background.getContainer())
    }
    renderBackgrounds() {
        for (const background of this.backgrounds) {
            this.renderBackground(background)
        }

    }
    resize() {
        this.container.setSize(this.size.multiply(this.getPixelSize()))
        this.container.setPosition(this.position.multiply(this.getPixelSize()))
        for (const background of this.backgrounds) {
            background.background.resize()


        }
        for (let component in this.components) {
            this.components[component].resize()
        }
        for (let channel in this.internalGuis) {
            for (let gui in this.internalGuis[channel]) {
                this.internalGuis[channel][gui].resize()
            }
        }
    }

    close() {
        this.container.style.display = "none"
        this.isOpen = false
        return this
    }
    handleGuiOpen(gui) {
        this.activeGuis[gui.getChannel()] = gui.getName()
        for (const internalGui in this.internalGuis[gui.getChannel()]) {
            this.internalGuis[gui.getChannel()][internalGui].close()
        }
    }
    addComponent(component, options = {}) {
        if (!this.isBuilt) {
            console.log("pushing", component)
            this.queue.push({
                component: component,
                options: options
            })
            return this
        }
        console.log(component)
        component.setParent(this).setParentalZLayer(this.getZLayer() + 1)
        if (component.isBuilt == false)
            component.build()
        this.components.push(component)
        if (options.fromBottom)
            component.position.y = this.size.y - component.position.y
        if (options.fromRight)
            component.position.x = this.size.x - component.position.x

        component.resize()
        this.attachContainer(component.getContainer())
        return this
    }
    setChannel(channel) {
        this.channel = channel
        return this
    }
    setId() {
        this.id = getUniqueIdentificator()
        return this
    }
    getId() {
        return this.id
    }
    setParrent(parent) {
        this.parent = parent
        return this
    }
    getPixelSize() {
        return this.pixelSize || this.parent.getPixelSize()
    }
    getActiveGui(channel) {
        return this.activeGuis.get(channel, "none")
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
    applyZLayer() {
        this.getContainer().setZLayer(this.z_layer_parental + this.z_layer_additional)
        return this
    }
    getZLayer() {
        return this.z_layer_parental + this.z_layer_additional
    }


    addGui(gui, channel = "none") {
        if (!this.isBuilt) {
            this.queue.push({
                component: gui,
                options: channel
            })
            return this
        }
        let shouldOpen = false
        gui.setId().setChannel(channel).setParrent(this).setParentalZLayer(this.getZLayer() + 1).build()
        if (this.internalGuis[channel] == undefined) {
            shouldOpen = true
            this.internalGuis[channel] = {}
            console.log("should open", gui.getName())
        }
        this.internalGuis[channel][gui.getId()] = gui
        gui.resize()
        this.attachContainer(gui.getContainer())
        if (shouldOpen)
            gui.open()
        return this
    }

}




