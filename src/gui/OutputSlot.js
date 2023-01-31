import { Slot } from "./Slot.js";


export default class OutputSlot extends Slot {
    constructor() {
        super()

    }

    onLeftClick() {
        if (window.game.getCursor().getItem().canAdd(this.getItem())) {
            window.game.getCursor().add(this.getItem())
        }

        // let toPlace, toGet
        // if (window.game.cursor.isEmpty()) {
        //     toPlace = window.game.cursor
        //     toGet = this
        // }
        // else {
        //     toPlace = this
        //     toGet = window.game.cursor

        // }
        // toPlace.add(toGet.getItem())
    }
    onRightClick() {
        // let one = false
        // let toPlace, toGet
        // if (window.game.cursor.isEmpty()) {
        //     toPlace = window.game.cursor
        //     toGet = this
        // }
        // else {
        //     toPlace = this
        //     toGet = window.game.cursor
        //     one = true

        // }
        // /** @type {ItemStack}*/


        // let getterItemStack = toGet.getItem()
        // let newItemStack = getterItemStack.copy()

        // let amountSmall = one ? getterItemStack.getAmount() - 1 : Math.floor(getterItemStack.getAmount() / 2)
        // let amountBig = getterItemStack.getAmount() - amountSmall

        // newItemStack.setAmount(amountBig)
        // getterItemStack.setAmount(amountSmall)

        // toPlace.add(newItemStack)
        // toGet.add(newItemStack)



    }
}