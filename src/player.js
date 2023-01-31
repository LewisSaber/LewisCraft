import { Entity } from "./entity.js";
import { Vector } from "./math.js";
import { KEYBIND_VALUES } from "./constants.js";
import Gui from "./gui/Gui.js";
import ItemStack from "./ItemStack.js";
import { BackGround } from "./gui/background.js";
import { Slot } from "./gui/Slot.js";
import { SlotCointainer } from "./gui/SlotContainer.js";
import { getImg, mergeObject, reverseObject } from "./utility.js";
import { CraftingTable } from "./CraftingTable.js";
import { Button } from "./gui/Button.js";

export class Player extends Entity {
    constructor(img_url, gl, vs, fs, map) {
        super(img_url, new Vector(0.85, 0.85), gl, vs, fs, map)
        this.position = new Vector()
        this.coordinates = new Vector(32, 30.1)
        this.speed = 4.2
        this.map = map
        this.is_shifting = false
        this.inventory = new Inventory(36)



        this.load()
        this.createInventoryGui()
        this.createHotbar()



        window.addEventListener("keydown", e => this.onKeydown(e));
        window.addEventListener("keyup", e => this.onKeyUp(e));
        this.loadKeyBinds()

        window.player = this
    }
    getGame() {
        return this.map.game
    }

    createHotbar() {


        this.hotbar = new SlotCointainer().setSize(9, 1)
        this.hotbar.selectedSlot = 1
        for (let i = 27; i < 36; i++) {
            let slot = new Slot().setItem(this.inventory.getItem(i)).build({ cancelPointerEvents: true })
            this.hotbar.addSlot(slot)
        }
        this.hotbar.build()

        this.hotbar.setPosition(2.1, 1.1)
        this.getGame().mapGui.addComponent(this.hotbar, { fromBottom: true })
        this.hotbar.getSlot(0).select()

    }
    createInventoryGui() {
        this.InventorySlots = this.createInventorySlots()
        let InventoryContainer = new SlotCointainer().setSize(9, 4).addSlotArray(this.InventorySlots).setPosition(.25, 3.9).build()
        this.InventoryGui = new Gui(this.map.game)
            .setName("inventroy")
            .setPosition(2, 0.6)
            .addBackground(new BackGround().setImg("./src/assets/background.png").setSize(12, 8).build())
        // .addBackground(, , )

        let leftButtons = [
            new Button().setBackground(getImg("background")).setIcon(getImg("craftingTableFront")).setSize(1, 1)
        ]
        let iter = 0
        for (const button of leftButtons) {
            button.setPosition(-1, 1.2 * iter)
            this.InventoryGui.addComponent(button)
            iter++
        }
        console.log(this.InventoryGui.queue)
        this.getGame().mainGui.addGui(this.InventoryGui, "main")
        this.InventoryGui.addComponent(InventoryContainer)

        this.craftingTableGui = new Gui()
            .setName("crafting table")
        //.setPosition(2, 0.6)
        this.InventoryGui.addGui(this.craftingTableGui, "main")

        this.craftingTable = new CraftingTable()
        this.craftingTableGui.addGui(this.craftingTable.getContainer().setPosition(0.25, 0.2))


    }

    createInventorySlots() {
        let slots = []
        for (let ItemStack of this.inventory.getAllInventory()) {
            slots.push(new Slot().setItem(ItemStack).build())
        }
        return slots
    }

    save() {
        let saving = {
            nick: this.nick,
            inventory: this.inventory.save(),
            keybinds: this.AllKeyBinds
        }
        console.log("saving")
        return saving
    }

    loadKeyBinds() {
        this.keyBinds = {}
        this.keyStates = {}
        this.AllKeyBinds = {}
        this.addKeyBind("KeyW", KEYBIND_VALUES.MOVEMENT.MOVE_FORWARD)
        this.addKeyBind("KeyS", KEYBIND_VALUES.MOVEMENT.MOVE_BACK)
        this.addKeyBind("KeyA", KEYBIND_VALUES.MOVEMENT.MOVE_LEFT)
        this.addKeyBind("KeyD", KEYBIND_VALUES.MOVEMENT.MOVE_RIGHT)
        this.addKeyBind("ArrowUp", KEYBIND_VALUES.ZOOMING.ZOOM_BIG)
        this.addKeyBind("ArrowDown", KEYBIND_VALUES.ZOOMING.ZOOM_SMALL)
        this.addKeyBind("KeyE", KEYBIND_VALUES.OPEN_INVENTORY)
        mergeObject(this.AllKeyBinds, this.loadedKeyBinds)
        this.keyBinds = reverseObject(this.AllKeyBinds)
    }

    getKeyBinds() {
        return this.AllKeyBinds
    }

    load() {
        let loading_value = this.getGame().session.getCurrentAccountPlayerInfo()
        if (typeof loading_value === "string") {
            loading_value = JSON.parse(loading_value)
        }
        this.nick = loading_value.nick
        this.inventory.load(loading_value.get("inventory", []))
        this.loadedKeyBinds = loading_value.get("keybinds", {})
    }

    addKeyBind(key, value) {
        this.AllKeyBinds[value] = key
        this.keyBinds = reverseObject(this.AllKeyBinds)
        this.keyStates[value] = false
    }

    render(options = {}) {
        window.game.setBuffer(this.map.entityBuffer)
        this.position = new Vector((this.map.getBlocksWidth() - this.getWidth()) / 2, this.map.getBlocksHeight() / 2 - this.getHeight() / 2)
        this.position.x = +this.position.x.toFixed(2)
        this.position.y = +this.position.y.toFixed(2)
        this.getSprite().render(this.position, options)
    }

    update(delta) {

        if (this.getGame().mainGui.getActiveGui("main") == "map") {
            this.move(new Vector(
                this.keyStates[KEYBIND_VALUES.MOVEMENT.MOVE_RIGHT] - this.keyStates[KEYBIND_VALUES.MOVEMENT.MOVE_LEFT],
                this.keyStates[KEYBIND_VALUES.MOVEMENT.MOVE_BACK] - this.keyStates[KEYBIND_VALUES.MOVEMENT.MOVE_FORWARD])
                .vectorize().scale(delta * this.speed))
            this.map.addZoom((this.keyStates.get(KEYBIND_VALUES.ZOOMING.ZOOM_BIG, 0) - this.keyStates.get(KEYBIND_VALUES.ZOOMING.ZOOM_SMALL, 0)) * 0.01)
        }
        if (this.keyStates[KEYBIND_VALUES.OPEN_INVENTORY]) {
            this.keyStates[KEYBIND_VALUES.OPEN_INVENTORY] = false
            if (this.InventoryGui.isOpen) {
                this.getGame().mapGui.open()
            }
            else
                this.InventoryGui.open()
        }
    }

    isShifting() {
        return this.is_shifting
    }

    canAddToInventory(ItemStack) {
        return this.inventory.canAdd(ItemStack)
    }

    addToInventory(ItemStack) {
        return this.inventory.add(ItemStack)
    }


    onKeydown({ code }) {

        this.keyStates[this.keyBinds.get(code, "unbind")] = 1
        if (code == "ShiftLeft")
            this.is_shifting = true
        if (this.getGame().mainGui.getActiveGui("main") == "map")
            if (/Digit[1-9]/.test(code)) {
                let digit = +code.replace("Digit", "")
                this.hotbar.getSlot(this.hotbar.selectedSlot - 1).unselect()
                this.hotbar.selectedSlot = digit
                this.hotbar.getSlot(digit - 1).select()
            }
    }
    onKeyUp({ code }) {
        if (code == "ShiftLeft")
            this.is_shifting = false
        this.keyStates[this.keyBinds.get(code, "unbind")] = 0
    }
}

export class Inventory {
    constructor(slots = 0) {
        this.inventory = []
        for (let i = 0; i < slots; i++) {
            this.inventory[i] = new ItemStack()
        }

    }
    getAllInventory() {
        return this.inventory
    }
    getItem(i) {
        return this.inventory[i]
    }
    /**
     * 
     * @param {ItemStack} ItemStack 
     */
    add(ItemStack) {
        for (const item of this.inventory) {

            item.add(ItemStack)
            if (ItemStack.isEmpty())
                break
        }
        return ItemStack
    }
    save() {
        let saving = []
        for (let i = 0; i < this.inventory.length; i++) {
            saving.push(this.inventory[i].save())
        }
        return saving
    }
    load(obj) {

        for (let i = 0; i < obj.length; i++) {
            this.inventory[i].load(obj[i])
        }
    }
    canAdd(ItemStack) {
        for (const item of this.inventory) {
            if (item.canAdd(ItemStack))
                return true

        }
        return false
    }


}