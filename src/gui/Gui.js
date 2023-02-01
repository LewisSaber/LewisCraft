

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
        this.queue = []
        this.z_layer_additional = 0
        this.z_layer_parental = 0
        this.activeGuis = {}
        this.positionalOptions = {
            fromButtom: false,
            fromRight: false
        }

    }
    setBackGround(img) {
        this.backgroundImg = img
        return this
    }
    getName() {
        return this.name
    }

    getFontSize() {
        return this.fontSize || this.parent.getFontSize()
    }
    setName(name) {
        this.name = name
        return this
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize
        if (this.isBuilt)
            this.applyFontSize(this.getPixelSize())
        return this
    }
    applyFontSize(pixelSize) {
        this.container.style.fontSize = this.getFontSize() * (pixelSize.x)
    }

    setPosition(x, y) {
        this.position = new Vector(x, y)
        if (this.isBuilt)
            this.resize()
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

    setSize(x, y) {
        this.size = new Vector(x, y)
        return this
    }

    applyDecoration() {
        if (this[`decoration${this.decoration}`])
            this.container.applyStyle(this[`decoration${this.decoration}`](this.size.multiply(this.getPixelSize())))
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
        this.applyZLayer()
        if (this.backgroundImg)
            this.getContainer().setBackgroundImage(this.backgroundImg)
        this.isBuilt = true
        for (let component of this.queue) {

            this.addComponent(component.component, component.channel)

        }
        delete this.queue

        return this
    }
    open() {

        if (this.parent && this.parent.isOpen) {
            if (this.getChannel() != "none")
                this.parent.handleComponentOpen(this)
        }
        this.container.style.display = "block"
        this.isOpen = true

    }

    resize() {
        let pixelSize = this.getPixelSize()
        this.container.setSize(this.size.multiply(pixelSize))
        let position = this.position.copy()
        if (this.parent) {


            if (this.positionalOptions.fromButtom) {
                position.y = this.parent.size.y - this.position.y
            }
            if (this.positionalOptions.fromRight) {
                position.x = this.parent.size.x - position.x
            }

        }
        this.container.setPosition(position.multiply(pixelSize))


        for (let channel in this.components) {
            for (let component in this.components[channel]) {

                this.components[channel][component].resize()
            }
        }
        this.applyDecoration()
        this.applyFontSize(pixelSize)
    }

    close() {
        this.container.style.display = "none"
        this.isOpen = false
        return this
    }
    handleComponentOpen(component) {
        this.activeGuis[component.getChannel()] = component.getName()
        for (const component_in in this.components[component.getChannel()]) {
            // console.log(component_in)
            this.components[component.getChannel()][component_in].close()
        }

    }

    positionFromButtom() {
        this.positionalOptions.fromButtom = true
        return this
    }

    positionFromRight() {
        this.positionalOptions.fromRight = true
        return this
    }

    addComponent(component, channel = "none") {
        if (!this.isBuilt) {

            this.queue.push({
                component: component,
                channel: channel
            })
            return this
        }
        component.setId().setChannel(channel).setParrent(this).setParentalZLayer(this.getZLayer() + 1).build()
        let shouldOpen = false
        if (this.components[channel] == undefined) {
            shouldOpen = true
            this.components[channel] = {}

        }
        if (channel == "none") {
            shouldOpen = true
        }
        this.components[channel][component.getId()] = component



        component.resize()

        if (shouldOpen)
            component.open()
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
            this.applyZLayer()
        }
        return this
    }

    setZLayer(layer) {
        this.z_layer_additional = layer
        if (this.isBuilt) {
            this.applyZLayer()
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



}




