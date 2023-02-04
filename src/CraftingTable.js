import { BackGround } from "./gui/Background.js";
import Gui from "./gui/Gui.js";
import { CRAFTING_RECIPE_MAP } from "./Recipes.js";
import { Slot } from "./gui/Slot.js";
import { SlotCointainer } from "./gui/SlotContainer.js";
import ItemStack from "./ItemStack.js";
import OutputSlot from "./gui/OutputSlot.js";
import { Inventory, Player } from "./player.js";
import { getImg } from "./utility.js";

console.log("initialised")
export class CraftingTable {
    constructor(game) {
        this.game = game
        this.createGui()

        this.inputSlots = []
        this.inputInventory = new Inventory(9)
        this.output = new ItemStack()

        this.outputSlot = new OutputSlot().setPosition(3, 1).setItem(this.output)
        for (let i = 0; i < 9; i++) {
            this.inputInventory.getItem(i).subscribeSlotToUpdate(() => { this.update() })
            let slot = new Slot()
                .setItem(this.inputInventory.getItem(i))
                .build()
            this.SlotContainer.addSlot(slot)
        }
        this.outputSlotContainer.addSlot(this.outputSlot)
        this.outputslotSubscriptionId = this.outputSlot.subscribeToAction(() => { this.onOutputClick() })
        this.recipeMap = CRAFTING_RECIPE_MAP
    }
    createGui() {
        let background = new BackGround().setImg(getImg("craftingarrow")).setSize(1, 1).setPosition(2.9 + 0.25, 0.25)
        let background2 = new BackGround().setDecoration(1)
        this.gui = new Gui().setName("craftingTable").setDraggable().setSize(4.5, 3.5).addComponent(background2).addComponent(background)
        this.outputSlotContainer = new SlotCointainer().setSize(1, 1).setPosition(3.25, 1.25).setZLayer(4)
        this.SlotContainer = new SlotCointainer().setSize(3, 3).setPosition(0.25, 0.25)
        this.gui.addComponent(this.SlotContainer).addComponent(this.outputSlotContainer)
    }
    getContainer() {
        return this.gui
    }
    getShiftedInput() {

        let shiftedSlots = []
        let topShift = 0
        if (this.inputInventory.getItem(0).isEmpty() && this.inputInventory.getItem(1).isEmpty() && this.inputInventory.getItem(2).isEmpty()) {
            topShift++
            if (this.inputInventory.getItem(3).isEmpty() && this.inputInventory.getItem(4).isEmpty() && this.inputInventory.getItem(5).isEmpty())
                topShift++
        }
        let leftShift = 0
        if (this.inputInventory.getItem(0).isEmpty() && this.inputInventory.getItem(3).isEmpty() && this.inputInventory.getItem(6).isEmpty()) {
            leftShift++
            if (this.inputInventory.getItem(1).isEmpty() && this.inputInventory.getItem(4).isEmpty() && this.inputInventory.getItem(7).isEmpty())
                leftShift++
        }
        for (let i = 0; i < 9; i++) {
            shiftedSlots[(i - topShift * 3 - leftShift + 9) % 9] = this.inputInventory.getItem(i)
        }
        return {
            slots: shiftedSlots,
            topShift: topShift,
            leftShift: leftShift
        }
    }

    update() {
        let recipe = this.recipeMap.getRecipe(this.getShiftedInput().slots)
        //console.log("recipe", recipe)
        if (recipe) {

            let output = recipe.getOutput(0).copy()
            this.outputSlot.setFakeItem(output)
        }
        else {
            this.outputSlot.removeFakeItem()
        }

    }
    onOutputClick() {
        let shifted = this.getShiftedInput()

        let recipe = this.recipeMap.getRecipe(shifted.slots)

        if (recipe) {
            let isPlayerShifting = window.game.getPlayer().isShifting()
            if ((isPlayerShifting && window.game.getPlayer().canAddToInventory(recipe.getOutput(0))) ||
                (!isPlayerShifting && window.game.getCursor().getItem().canAdd(recipe.getOutput(0)))) {

                for (let i = 0; i < 9; i++) {
                    if (!recipe.getShiftedInput(i).isEmpty()) {
                        let item = recipe.getShiftedInput(i).copy()
                        item.getItem().amount *= -1
                        shifted.slots[i].add(item)
                    }
                }
                if (isPlayerShifting) {
                    window.game.getPlayer().addToInventory(recipe.getOutput(0).copy())
                    this.onOutputClick()
                }
                else {
                    this.outputSlot.setItem(recipe.getOutput(0).copy())
                }
            }
        }
    }
}