
import { Slot } from "./gui/Slot.js";
import ItemStack from "./ItemStack.js";
import { Vector } from "./math.js"
import Tooltip from "./Tooltip.js";



export default class Cursor {
    constructor(game) {
        this.position = new Vector()
        this.item = new ItemStack()
        this.slot = new Slot().addItem(this.item).setDecoration(1).setParent(game.mainGui).build({ cancelPointerEvents: true })
        this.toolTip = new Tooltip()
        this.keyStates = {}

        window.addEventListener("mousemove", e => this.onMouseMove(e));
        window.addEventListener("keydown", (evt) => { this.onKeyDown(evt) })
        window.addEventListener("keyup", (evt) => { this.onKeyUp(evt) })
        this.slot.getItem().subscribeSlotToUpdate({ update: () => this.makeToolTip() })
        this.createTag()
        this.container.appendChild(this.slot.getContainer())
        this.container.appendChild(this.toolTip.getContainer())
        this.attachContainer()


        // window.addEventListener("tick", e => this.update(e));
    }
    onMouseMove(evt) {
        this.position.x = evt.clientX
        this.position.y = evt.clientY

    }
    resize() {
        this.slot.resize()
    }
    createTag() {

        this.container = document.createElement("div")
        this.container.style.zIndex = "1000"
        this.container.style.position = "absolute"
        this.container.style.top = "0px"
        this.container.style.left = "0px"
        this.container.style.pointerEvents = "none"


    }
    add(ItemStack) {
        return this.slot.add(ItemStack)

    }
    attachContainer() {
        document.getElementById("body").appendChild(this.container)
    }
    update() {
        this.container.setPosition(this.position)
    }
    isEmpty() {
        return this.slot.isEmpty()
    }
    getItem() {
        return this.slot.getItem()
    }
    getUpdateId() {
        return this.slot.getUpdateId()
    }
    addItem(ItemStack) {
        this.slot.addItem(ItemStack)
    }
    makeToolTip(ItemStack) {
        let options = {
            shift: this.keyStates.get("ShiftLeft", 0)
        }
        this.toolTip.makeItemToolTip(ItemStack, options)

        if (ItemStack == undefined)
            ItemStack = this.toolTip.getItem()

        if (this.isEmpty() && !ItemStack.isEmpty()) {
            this.toolTip.show()
        }
        else {
            this.toolTip.hide()
        }
    }
    ClearToolTip() {
        this.toolTip.clear()
    }
    onKeyDown({ code }) {

        this.keyStates[code] = 1
        if (code == "ShiftLeft")
            this.makeToolTip()
    }
    onKeyUp({ code }) {

        this.keyStates[code] = 0
        if (code == "ShiftLeft")
            this.makeToolTip()
    }
}