import { Vector } from "./../math.js"
import Gui from "./Gui.js"
import { Slot } from "./Slot.js"

export class SlotCointainer extends Gui {
    constructor() {
        super()
        /**  @type {Slot[]} */
        this.slots = []
        this.fontSize = .25
        this.isEmptyExpandable = false
    }
    /**Makes container have initially 1 slot, every item reveal next slot */
    becomeEmptyExpandable() {
        this.isEmptyExpandable = true
        return this
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
        // this.container.style.pointerEvents = "all"
        this.container.disableContextMenu()
        return this
    }
    resize() {
        super.resize()
        let widthsum = 0
        for (let i = 0; i < this.size.x; i++) {
            widthsum += this.slots[i].size.x
        }

        let heightsum = 0
        for (let i = 0; i < this.size.y; i++) {
            heightsum += this.slots[i].size.y
        }
        this.container.setSize(new Vector(widthsum, heightsum).multiply(this.getPixelSize()))

        for (let slot of this.slots)
            slot.resize()
    }
    /** @param {Slot} slot  */
    pushSlot(slot) {

        slot.setParent(this)
        //Unsaved id
        slot.getItem().subscribeSlotToUpdate(this)
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
        this.update()
        this.isBuilt = true
        this.container.onmouseleave = () => { this.onMouseLeave() }
        return this
    }
    onMouseLeave() {
        window.game.getCursor().clearTooltip()
    }
    update() {
        if (this.isEmptyExpandable) {
            let foundItem = false
            for (let i = this.slots.length - 1; i > 0; i--) {
                if (foundItem) {
                    this.slots[i].show()
                } else {
                    if (!this.slots[i - 1].isEmpty()) {
                        foundItem = true
                        this.slots[i].show()
                    }
                    else
                        this.slots[i].hide()
                }
            }
        }
    }
}
