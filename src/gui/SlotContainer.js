import { Vector } from "./../math.js"
import Gui from "./Gui.js"

export class SlotCointainer extends Gui {
    constructor() {
        super()
        /**  @type {Slot[]} */
        this.slots = []
        this.fontSize = .25
    }

    getSlot(i) {
        return this.slots[i]
    }
    addSlot(Slot) {
        if (!Slot.isBuilt) {
            Slot.build()
        }
        let length = this.slots.length
        let x = length % this.size.x
        let y = length / this.size.x >> 0//(length - x) % this.size.y

        Slot.setPosition(new Vector(x, y).add_vec(Slot.position))
        this.slots.push(Slot)
        return this
    }
    addSlotArray(Slots) {
        for (const slot of Slots) {
            this.addSlot(slot)
        }

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
        this.container.style.pointerEvents = "all"

        return this
    }
    resize() {
        super.resize()
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
        super.build()
        this.pushSlots()
        this.isBuilt = true
        this.container.onmouseleave = () => { this.onMouseLeave() }
        return this
    }
    onMouseLeave() {
        window.game.cursor.toolTip.clear()
    }
}
