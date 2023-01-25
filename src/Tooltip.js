import { getRarityColor } from "./Item.js";
import ItemStack from "./ItemStack.js";
import TranslateName, { TranslateRarity } from "./Translator.js";

export default class Tooltip {
    constructor() {
        this.item = new ItemStack()
        this.createContainer()
        this.hide()
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
    makeItemToolTip(item, options) {
        if (item != undefined) {
            this.item = item
        }
        item = this.item.getItem()
        this.container.style.borderColor = getRarityColor(item.getRarity())
        this.container.innerHTML = `
            ${TranslateName(item.name).color(getRarityColor(item.getRarity()))}<br>
           
           ${(TranslateRarity(item.getRarity) + " " + item.getType()).toUpperCase().color(getRarityColor(item.getRarity()))}`

        //`trash ${options.shift ? 'yes'.color("green") : 'no'}`
    }
    clear() {
        this.hide()
        this.item = new ItemStack()
    }
    getItem() {
        return this.item
    }
}