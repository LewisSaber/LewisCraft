import { Entity } from "./entity.js";
import { Vector } from "./math.js";
import { KEYBIND_VALUES } from "./constants.js";
import Gui from "./gui/Gui.js";
import ItemStack from "./ItemStack.js";
import { BackGround } from "./gui/background.js";
import { Slot } from "./gui/Slot.js";
import { SlotCointainer } from "./gui/SlotContainer.js";

export class Player extends Entity {
    constructor(img_url, gl, vs, fs, map) {
        super(img_url, new Vector(0.85, 0.85), gl, vs, fs, map)
        this.position = new Vector()
        this.coordinates = new Vector(32, 32)
        this.speed = 4.2
        this.map = map

        this.inventory = new Inventory(36)



        this.load()
        this.createInventoryGui()
        this.createHotbar()



        window.addEventListener("keydown", e => this.onKeydown(e));
        window.addEventListener("keyup", e => this.onKeyUp(e));
        this.loadKeyBinds()
        this.g = new ItemStack("Sand", 33)
        window.player = this
    }
    getGame() {
        return this.map.game
    }
    createOptionGui() {


    }
    createMainGui() {
        // this.createHotbar()
        // this.mainGui = new Gui(this.map.game)
        //     .setName("map")
        //     .addBackground(new BackGround().setImg("./src/assets/background.png").setPosition(new Vector(1.75, 1.2)).setSize(new Vector(9.5, 1.2)).build(), { fromBottom: true })

        // this.getGame().mainGui.addGui(this.mainGui, "main")

        // this.hotbar.setPosition(new Vector(2.1, 1.1))
        // this.mainGui.addComponent(this.hotbar, { fromBottom: true })


        // this.mainGui.open()
    }
    createHotbar() {
        this.hotbar = new SlotCointainer().setSize(new Vector(9, 1))
        for (let i = 27; i < 36; i++) {
            let slot = new Slot().addItem(this.inventory.getSlot(i)).build()
            this.hotbar.addSlot(slot)
        }
        this.hotbar.build()
        this.hotbar.setPosition(new Vector(2.1, 1.1))
        this.getGame().mapGui.addComponent(this.hotbar, { fromBottom: true })

    }
    createInventoryGui() {
        this.InventorySlots = this.createInventorySlots()
        let InventoryContainer = new SlotCointainer().setSize(new Vector(9, 4)).addSlotArray(this.InventorySlots).setPosition(new Vector(2.1, 4.5)).build()
        this.InventoryGui = new Gui(this.map.game)
            .setName("inventroy")
            .setWidth(20)
            .addBackground(new BackGround().setImg("./src/assets/background.png").setSize(new Vector(12, 8)).setPosition(new Vector(2, 0.6)).build())
        // .addBackground(, , )


        this.getGame().mainGui.addGui(this.InventoryGui, "main")
        this.InventoryGui.addComponent(InventoryContainer)
    }
    createInventorySlots() {
        let slots = []
        for (let ItemStack of this.inventory.getAllInventory()) {
            slots.push(new Slot().addItem(ItemStack).build())
        }
        return slots
    }
    save() {
        let saving = {
            nick: this.nick,
            inventory: this.inventory.save()
        }
        console.log("saving")
        return JSON.stringify(saving)
    }


    loadKeyBinds() {
        this.keyBinds = {}
        this.keyStates = {}
        this.addKeyBind("KeyW", KEYBIND_VALUES.MOVEMENT.MOVE_FORWARD)
        this.addKeyBind("KeyS", KEYBIND_VALUES.MOVEMENT.MOVE_BACK)
        this.addKeyBind("KeyA", KEYBIND_VALUES.MOVEMENT.MOVE_LEFT)
        this.addKeyBind("KeyD", KEYBIND_VALUES.MOVEMENT.MOVE_RIGHT)
        this.addKeyBind("ArrowUp", KEYBIND_VALUES.ZOOMING.ZOOM_BIG)
        this.addKeyBind("ArrowDown", KEYBIND_VALUES.ZOOMING.ZOOM_SMALL)
        this.addKeyBind("KeyE", KEYBIND_VALUES.OPEN_INVENTORY)
    }
    load() {
        let loading_value = this.getGame().session.getCurrentAccountPlayerInfo()
        if (typeof loading_value === "string") {
            loading_value = JSON.parse(loading_value)
        }
        this.nick = loading_value.nick
        if (loading_value.inventory)
            this.inventory.load(loading_value.inventory)
    }

    addKeyBind(key, value) {
        this.keyBinds[key] = value
        this.keyStates[value] = false
    }
    render(options = {}) {
        window.game.setBuffer(this.map.entityBuffer)
        this.position = new Vector((this.map.getBlocksWidth() - this.getWidth()) / 2, this.map.getBlocksHeight() / 2 - this.getHeight() / 2)
        this.getSprite().render(this.position, options)
    }

    update(delta) {

        this.move(new Vector(
            this.keyStates[KEYBIND_VALUES.MOVEMENT.MOVE_RIGHT] - this.keyStates[KEYBIND_VALUES.MOVEMENT.MOVE_LEFT],
            this.keyStates[KEYBIND_VALUES.MOVEMENT.MOVE_BACK] - this.keyStates[KEYBIND_VALUES.MOVEMENT.MOVE_FORWARD])
            .vectorize().scale(delta * this.speed))
        this.map.addZoom((this.keyStates.get(KEYBIND_VALUES.ZOOMING.ZOOM_BIG, 0) - this.keyStates.get(KEYBIND_VALUES.ZOOMING.ZOOM_SMALL, 0)) * 0.01)

        if (this.keyStates[KEYBIND_VALUES.OPEN_INVENTORY]) {
            this.keyStates[KEYBIND_VALUES.OPEN_INVENTORY] = false
            if (this.InventoryGui.isOpen) {
                this.getGame().mapGui.open()
            }
            else
                this.InventoryGui.open()
        }
    }


    onKeydown({ code }) {

        this.keyStates[this.keyBinds.get(code, "unbind")] = 1
    }
    onKeyUp({ code }) {

        this.keyStates[this.keyBinds.get(code, "unbind")] = 0
    }
}

class Inventory {
    constructor(slots = 0) {
        this.inventory = []
        for (let i = 0; i < slots; i++) {
            this.inventory[i] = new ItemStack()
        }

    }
    getAllInventory() {
        return this.inventory
    }
    getSlot(i) {
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

        for (let i = 0; i < this.inventory.length; i++) {
            this.inventory[i].load(obj[i])
        }
    }


}