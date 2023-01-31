import { classes, getDeprecatedName } from "./Item.js"
import { getUniqueIdentificator } from "./utility.js"


export default class ItemStack {
    constructor(itemName = "Empty", amount = 0) {

        this.item = new classes[itemName](amount)
        this.subscribed = {}
        this.update()
    }
    isEmpty() {

        return this.item.name == "Empty" || this.item.amount == 0
    }
    isSame(ItemStack) {

        return ItemStack.item.name == this.item.name
    }
    canAdd(ItemStack) {
        if (this.isEmpty())
            return true
        if (this.isSame(ItemStack))
            if (this.item.getEmpty() >= ItemStack.getAmount())
                return true
        return false
    }
    add(ItemStack) {
        if (this.isEmpty()) {
            this.item = ItemStack.item
            ItemStack.item = new classes.Empty()
        }
        if (this.isSame(ItemStack)) {
            ItemStack.setAmount(this.addAmount(ItemStack.getAmount()))

        }
        if (this.getAmount() == 0) {
            this.item = new classes.Empty()
        }
        this.update()
        ItemStack.update()
        return ItemStack
    }
    setItem(item) {
        this.item = item
        this.update()
        return this
    }
    getItem() {
        return this.item
    }
    getAmount() {
        return this.item.amount
    }
    getName() {
        return this.item.name
    }
    setAmount(amount) {
        this.item.amount = amount
        if (this.item.amount <= 0) {
            this.item = new classes.Empty()
        }
        this.update()
    }
    addAmount(amount) {
        let empty = this.item.getEmpty()

        if (amount > empty) {
            this.item.amount += empty
            amount -= empty
        }
        else {
            this.item.amount += amount
            amount = 0
        }
        this.update()
        return amount

    }
    decreaseAmount(amount) {
        this.item.amount -= amount
        if (this.item.amount <= 0) {
            this.item = new classes.Empty()
        }
        this.update()
    }
    subscribeSlotToUpdate(slot) {
        let id = getUniqueIdentificator()
        this.subscribed[id] = slot
        return id
    }
    removeSlotFromUpdate(id) {
        delete this.subscribed[id]
    }
    update() {
        for (let id in this.subscribed) {
            this.subscribed[id].update()
        }
    }

    copy() {
        return new ItemStack(this.item.name, this.item.amount)

    }
    save() {
        return this.item.save()
    }
    load(obj) {

        this.item = new classes[obj.name](obj.amount)
        for (const prop in obj) {
            this.item[prop] = obj[prop]
        }
        this.item.name = getDeprecatedName(this.item.name)
        this.update()
    }
}
