import GUIComponent from "./GUIComponent.js"
import { Vector } from "./../math.js"

export class SlotCointainer extends GUIComponent {
    constructor() {
        super()
        /**  @type {Slot[]} */
        this.slots = []

    }
    getPixelSize() {
        return this.pixelSize || this.parent.getPixelSize()
    }
    addSlot(Slot) {
        let length = this.slots.length
        let y = length % this.size.y
        let x = length % this.size.x
        Slot.setPosition(new Vector(x, y))
        this.slots.push(Slot)
        return this
    }
    addSlotArray(Slots) {
        for (const slot of Slots) {
            this.addSlot(slot)
        }
        // this.slots = this.slots.concat(Slots)
        return this
    }
    getSlots() {
        return this.slots
    }
    getWindowSize() {
        return new Vector(window.innerWidth, window.innerHeight)
    }

    createContainer() {
        this.container = document.createElement("div")
        this.container.style.position = "absolute"

        return this
    }
    resize() {
        this.container.setPosition(this.position.multiply(this.parent.getPixelSize()))
        let widthsum = 0
        for (let i = 0; i < this.size.x; i++) {
            widthsum += this.slots[i].size.x
        }

        let heightsum = 0
        for (let i = 0; i < this.slots.length; i += this.size.y) {
            heightsum += this.slots[i].size.y
        }
        this.container.setSize(new Vector(widthsum, heightsum).multiply(this.getPixelSize()))

        for (let slot of this.slots)
            slot.resize()
    }
    pushSlot(slot) {

        slot.setParent(this)
        this.container.appendChild(slot.getContainer())
        return this
    }
    pushSlots() {

        for (let slot of this.slots) {
            this.pushSlot(slot)
        }
        return this
    }
    build() {
        this.createContainer()
        this.pushSlots()
        this.isBuilt = true
        return this
    }
}
