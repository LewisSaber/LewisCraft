import { getRarityColor } from "./Item.js";
import ItemStack from "./ItemStack.js";
import TranslateName, { TranslateRarity } from "./Translator.js";
console.log("initialised")
export default class Tooltip {
    constructor() {
        this.item = new ItemStack()
        this.createContainer()
        this.hide()
        this.isText = false
    }
    createContainer() {
        this.container = document.createElement("div")
        this.container.style.maxWidth = "40vw"
        this.container.style.minWidth = "15vw"
        this.container.id = "tooltip_container"
    }
    getContainer() {
        return this.container
    }
    hide() {
        this.container.style.display = "none"
    }

    show() {
        this.container.style.display = "block"
    }

    setClearingInterval(interval) {
        this.clearingInterval = interval
        return this
    }
    makeTextTooltip(func, options = {}) {
        this.isText = true
        if (func != undefined)
            this.text = func
        this.container.style.borderColor = getRarityColor(0)
        this.container.innerHTML = this.text(options)
    }
    makeItemTooltip(slot, options) {
        this.isText = false
        if (this.clearingInterval) {
            clearInterval(this.clearingInterval)
            delete this.clearingInterval
        }
        if (slot == undefined && this.item.isEmpty()) {

            return
        }
        if (slot != undefined) {
            this.item = slot
        }
        else
            slot = this.item

        let Itemstack = slot.getItem()
        let item = Itemstack.getItem()
        this.container.style.borderColor = getRarityColor(item.getRarity())
        this.container.innerHTML = `
            ${TranslateName(item.name).color(getRarityColor(item.getRarity()))}<br>
            ${item.getBurnValue() ? "Burn Value: " + item.getBurnValue().toString().color("#cccfcd") + "<br>" : ""}
           ${(item.getAdditionalTooltip())}

            ${slot.getAdditionalInfo()}
           ${(TranslateRarity(item.getRarity()) + " " + item.getType()).toUpperCase().color(getRarityColor(item.getRarity()))}`

        //`trash ${options.shift ? 'yes'.color("green") : 'no'}`
    }
    clear() {
        this.hide()
        this.item = new ItemStack()
        this.text = undefined
        this.isText = false
    }
    getItem() {
        return this.item
    }
}