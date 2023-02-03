import { Vector } from "./../math.js"
import ItemStack from "../ItemStack.js"
import { getImg, getUniqueIdentificator } from "../utility.js"

export class Slot {
    constructor() {
        // this.item = new ItemStack("Empty")
        this.isBuilt = false
        this.decoration = 0
        this.size = new Vector(1, 1)
        this.isSelected = false
        this.position = new Vector()
        this.actionSubscribers = {
            "left": {},
            "right": {}
        }
        this.filterFunction = () => { return true }
        this.additionalInfo = ""
    }
    setAdditionalInfo(info) {
        this.additionalInfo = info
        return this
    }
    setSize(vector) {
        this.size = vector
        return this
    }
    setFilter(func) {
        this.filterFunction = func
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
            "box-shadow": 'rgba(0, 0, 0, 0.24) -2px -3px 0px',
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
    setFakeItem(ItemStack) {
        this.fakeItem = ItemStack.copy()
        this.update()
    }
    removeFakeItem() {
        delete this.fakeItem
        this.update()
    }
    decoration1(size) {
        return {

            width: `${size.x * 0.8}px`,
            height: `${size.x * 0.8}px`
        }
    }
    setItem(ItemStack) {
        /**  @type {ItemStack} */
        this.item = ItemStack
        this.subscribingId = this.item.subscribeSlotToUpdate(this)
        this.onPlacing()
        return this
    }
    add(ItemStack) {
        if (this.filterFunction(ItemStack))
            return this.item.add(ItemStack)
        return ItemStack

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
    subscribeToAction(action, type = "left") {
        let id = getUniqueIdentificator()
        this.actionSubscribers[type][id] = action
        return id
    }
    unsubscribeFromAction(id) {
        if (id) {
            for (let action of this.actionSubscribers) {
                delete this.actionSubscribers[action][id]
            }
        }
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
            this.setItem(new ItemStack("Empty"))
        this.createTag(options)
        this.update()
        this.isBuilt = true
        return this
    }
    update() {
        if (this.fakeItem) {
            this.itemAmountContainer.innerHTML = this.fakeItem.getAmount() > 1 ? this.fakeItem.getAmount() : ""
            this.container.setBackgroundImage(this.fakeItem.isEmpty() ? "none" : getImg(this.fakeItem.getName()))
        }
        else {
            this.itemAmountContainer.innerHTML = this.item.getAmount() > 1 ? this.item.getAmount() : ""
            this.container.setBackgroundImage(this.item.isEmpty() ? "none" : getImg(this.item.getName()))
        }

    }
    isEmpty() {
        return this.item.isEmpty()
    }
    handleClick(evt) {
        evt.stopPropagation()

        switch (evt.button) {
            case 0:
                for (let subscriber in this.actionSubscribers.left) {
                    this.actionSubscribers.left[subscriber]()
                }
                this.onLeftClick();
                break;
            case 2:
                for (let subscriber in this.actionSubscribers.right) {
                    this.actionSubscribers.right[subscriber]()
                }
                this.onRightClick();
                break;
        }
    }
    getUpdateId() {
        return this.subscribingId
    }
    onLeftClick() {
        if (window.game.cursor.isEmpty() && this.isEmpty())
            return
        let toPlace, toGet
        if (window.game.cursor.isEmpty()) {
            toPlace = window.game.cursor.getSlot()
            toGet = this
        }
        else {
            toPlace = this
            toGet = window.game.cursor.getSlot()

        }
        toPlace.add(toGet.getItem())
        if (toGet.isEmpty()) {
            toGet.onRemoval(toPlace)
        }
        toPlace.onPlacing()
    }
    onRemoval() {
        //console.log("removing", this.item)
    }
    onPlacing() {
        // console.log("placing", this.item)
    }
    onRightClick() {
        let one = false
        let toPlace, toGet
        if (window.game.cursor.isEmpty()) {
            toPlace = window.game.cursor.getSlot()
            toGet = this
        }
        else {
            toPlace = this
            toGet = window.game.cursor.getSlot()
            one = true

        }
        /** @type {ItemStack}*/


        let getterItemStack = toGet.getItem()
        let newItemStack = getterItemStack.copy()

        let amountSmall = one ? getterItemStack.getAmount() - 1 : Math.floor(getterItemStack.getAmount() / 2)
        let amountBig = getterItemStack.getAmount() - amountSmall

        newItemStack.setAmount(amountBig)
        getterItemStack.setAmount(amountSmall)

        toPlace.add(newItemStack)
        toGet.add(newItemStack)



    }
    select() {
        this.isSelected = true
        this.applyDecoration()
    }
    getTooltipItem() {
        return this.fakeItem ? this.fakeItem : this.item
    }
    canAdd(ItemStack) {
        return this.getItem().canAdd(ItemStack)
    }
    onMouseEnter(event) {
        this.select()
        window.game.cursor.makeTooltip(this)
    }
    unselect() {
        this.isSelected = false
        this.applyDecoration()
    }
    onMouseLeave() {
        window.game.getCursor().getTooltip().setClearingInterval(setTimeout(() => { window.game.getCursor().getTooltip().clear() }, 100))
        this.unselect()

    }
    getItem() {
        return this.item
    }
    getAdditionalInfo() {
        return this.additionalInfo ? this.additionalInfo + "<br>" : ""
    }
    show() {
        this.container.style.visibility = "visible"
    }
    hide() {
        this.container.style.visibility = "hidden"
    }
}
