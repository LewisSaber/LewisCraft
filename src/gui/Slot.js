import { Vector } from "./../math.js"
import ItemStack from "../ItemStack.js"

export class Slot {
    constructor() {
        // this.item = new ItemStack("Empty")
        this.isBuilt = true
        this.decoration = 0
        this.size = new Vector(1, 1)
        this.isSelected = false
        this.position = new Vector()
    }
    setSize(vector) {
        this.size = vector
        return this
    }
    applyDecoration() {
        if (this.isSelected)
            this.container.applyStyle(this[`decoration${this.decoration}enter`](this.size.multiply(this.getPixelSize())))
        else
            this.container.applyStyle(this[`decoration${this.decoration}`](this.size.multiply(this.getPixelSize())))
    }
    getPixelSize() {
        return this.pixelSize || this.parent.getPixelSize()
    }
    setPosition(vector) {
        this.position = vector
        return this
    }

    decoration0(size) {

        return {
            border: `inset ${size.x * 0.05}px #5f5f5f`,
            "--size": `${size.x * 0.9}px`,
            width: `var(--size)`,
            height: `var(--size)`,
        }
    }
    decoration0enter(size) {

        return {
            border: `inset ${size.x * 0.07}px #5f5f5f`,

        }
    }

    decoration1(size) {
        return {

            width: `${size.x * 0.8}px`,
            height: `${size.x * 0.8}px`
        }
    }
    addItem(ItemStack) {
        /**  @type {ItemStack} */
        this.item = ItemStack
        this.subscribingId = this.item.subscribeSlotToUpdate(this)
        return this
    }
    add(ItemStack) {
        return this.item.add(ItemStack)

    }
    setDecoration(decoration) {
        if (this[`decoration${decoration}`] == undefined) {
            console.warn("no decoration found with id", decoration, ". Setting decoration to 0")
            decoration = 0
        }
        this.decoration = decoration
        return this
    }
    resize() {
        this.applyDecoration()
        this.itemAmountContainer.style.marginRight = `${this.size.x * this.getPixelSize().x * .02}px`
        this.container.setPosition(this.position.multiply(this.getPixelSize()))
    }
    setParent(parent) {
        this.parent = parent
        return this
    }

    createTag(options) {

        this.container = document.createElement("div")
        // this.container.style.display = "block"
        // this.container.style.float = "left"
        this.container.style.backgroundSize = "Cover"
        this.container.style.imageRendering = "Pixelated"
        this.container.style.pointerEvents = options.get("cancelPointerEvents", false) ? "none" : "all"
        this.container.style.position = "absolute"
        this.container.style.boxSizing = "border-box"


        this.itemAmountContainer = document.createElement("div")
        this.itemAmountContainer.style.position = "absolute"
        this.itemAmountContainer.style.right = "0px"
        this.itemAmountContainer.style.bottom = "0px"

        this.itemAmountContainer.style.fontFamily = "Minecraftia"
        this.itemAmountContainer.innerText = 0
        this.itemAmountContainer.disablePointerEvents()
        this.container.appendChild(this.itemAmountContainer)
        this.container.disableContextMenu()

        this.container.onmousedown = (evt) => { this.handleClick(evt) }
        this.container.onmouseenter = (evt) => { this.onMouseEnter(evt) }
        this.container.onmouseleave = (evt) => { this.onMouseLeave(evt) }
    }
    getWindowSize() {
        return new Vector(window.innerWidth, window.innerHeight)
    }
    getContainer() {
        return this.container
    }
    build(options = {}) {
        if (this.item == undefined)
            this.addItem(new ItemStack("Empty"))
        this.createTag(options)
        this.update()
        this.isBuilt = true
        return this
    }
    update() {
        this.itemAmountContainer.innerHTML = this.item.getAmount() >= 1 ? this.item.getAmount() : ""
        this.container.setBackgroundImage(this.item.isEmpty() ? "none" : `./src/assets/${this.item.getName()}.png`)

    }
    isEmpty() {
        return this.item.isEmpty()
    }
    handleClick(evt) {

        switch (evt.button) {
            case 0: this.onLeftClick(); break;
            case 2: this.onRightClick(); break;
        }
    }
    getUpdateId() {
        return this.subscribingId
    }
    onLeftClick() {
        let toPlace, toGet
        if (window.game.cursor.isEmpty()) {
            toPlace = window.game.cursor
            toGet = this
        }
        else {
            toPlace = this
            toGet = window.game.cursor

        }
        toPlace.add(toGet.getItem())
    }
    onRightClick() {
        let one = false
        let toPlace, toGet
        if (window.game.cursor.isEmpty()) {
            toPlace = window.game.cursor
            toGet = this
        }
        else {
            toPlace = this
            toGet = window.game.cursor
            one = true

        }
        /** @type {ItemStack}*/


        let getterItemStack = toGet.getItem()
        let newItemStack = new ItemStack().setItem(getterItemStack.copy())

        let amountSmall = one ? getterItemStack.getAmount() - 1 : Math.floor(getterItemStack.getAmount() / 2)
        let amountBig = getterItemStack.getAmount() - amountSmall

        newItemStack.setAmount(amountBig)
        getterItemStack.setAmount(amountSmall)

        toPlace.add(newItemStack)
        toGet.add(newItemStack)



    }
    onMouseEnter(event) {
        this.isSelected = true
        this.applyDecoration()
        window.game.cursor.makeToolTip(this.item, event)
    }
    onMouseLeave() {
        this.isSelected = false
        this.applyDecoration()
    }
    getItem() {
        return this.item
    }
}
