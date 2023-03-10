import { Entity } from "./entity.js";
import { Vector } from "./math.js";
import { KEYBIND_VALUES } from "./constants.js";
import Gui from "./gui/Gui.js";
import ItemStack from "./ItemStack.js";
import { BackGround } from "./gui/Background.js";
import { Slot } from "./gui/Slot.js";
import { SlotCointainer } from "./gui/SlotContainer.js";
import { getImg, mergeObject, reverseObject } from "./utility.js";
import { CraftingTable } from "./CraftingTable.js";
import { Button } from "./gui/Button.js";
import { classes, getRarityColor } from "./Item.js";
import TranslateName from "./Translator.js";
import { closingButton } from "./gui/GuiUtilityComponents.js";

console.log("initialised")
export class Player extends Entity {
    constructor(img_url, gl, vs, fs, map) {
        super(img_url, new Vector(0.85, 0.85), gl, vs, fs, map)
        this.position = new Vector()
        this.coordinates = new Vector(32, 30.1)
        this.speed = 4.2
        this.map = map
        this.is_shifting = false
        this.inventory = new Inventory(36)
        this.backpacks = new Inventory(18)
        this.machines = new Inventory(9)


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




    loadKeyBinds() {
        this.keyBinds = {}
        this.keyStates = {}
        this.AllKeyBinds = {}
        this.addKeyBind("KeyW", KEYBIND_VALUES.MOVEMENT.MOVE_FORWARD)
        this.addKeyBind("KeyS", KEYBIND_VALUES.MOVEMENT.MOVE_BACK)
        this.addKeyBind("KeyA", KEYBIND_VALUES.MOVEMENT.MOVE_LEFT)
        this.addKeyBind("KeyD", KEYBIND_VALUES.MOVEMENT.MOVE_RIGHT)
        this.addKeyBind("KeyR", KEYBIND_VALUES.SEARCH_RECIPE)
        this.addKeyBind("KeyU", KEYBIND_VALUES.SEARCH_USAGE)
        //this.addKeyBind("ArrowUp", KEYBIND_VALUES.ZOOMING.ZOOM_BIG)
        // this.addKeyBind("ArrowDown", KEYBIND_VALUES.ZOOMING.ZOOM_SMALL)
        this.addKeyBind("KeyE", KEYBIND_VALUES.OPEN_INVENTORY)
        mergeObject(this.AllKeyBinds, this.loadedKeyBinds)
        this.keyBinds = reverseObject(this.AllKeyBinds)
    }

    getKeyBinds() {
        return this.AllKeyBinds
    }

    save() {
        let saving = {
            nick: this.nick,
            inventory: this.inventory.save(),
            backpacks: this.backpacks.save(),
            machines: this.machines.save(),
            keybinds: this.AllKeyBinds
        }
        console.log("saving")
        return saving
    }

    load() {
        let loading_value = this.getGame().session.getCurrentAccountPlayerInfo()
        if (typeof loading_value === "string") {
            loading_value = JSON.parse(loading_value)
        }
        this.nick = loading_value.nick
        this.inventory.load(loading_value.get("inventory", []))
        this.machines.load(loading_value.get("machines", []))
        this.backpacks.load(loading_value.get("backpacks", []))
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
            if (this.rootInventoryGui.isOpen) {
                this.getGame().mapGui.open()
            }
            else
                this.rootInventoryGui.open()
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
        if (this.keyStates[KEYBIND_VALUES.SEARCH_RECIPE]) {
            let item = game.getCursor().getTooltip().getItem().getTooltipItem()
            if (!item.isEmpty()) {
                this.getGame().getNEI().showRecipe(item)
            }
        }
        if (this.keyStates[KEYBIND_VALUES.SEARCH_USAGE]) {
            let item = game.getCursor().getTooltip().getItem().getTooltipItem()
            if (!item.isEmpty()) {
                this.getGame().getNEI().showUsage(item)
            }
        }
    }
    onKeyUp({ code }) {
        if (code == "ShiftLeft")
            this.is_shifting = false
        this.keyStates[this.keyBinds.get(code, "unbind")] = 0
    }



    //GUI WORK
    createHotbar() {


        this.hotbar = new SlotCointainer().setSize(9, 1).positionFromButtom()
        this.hotbar.selectedSlot = 1
        for (let i = 27; i < 36; i++) {
            let slot = new Slot().setItem(this.inventory.getItem(i)).build({ cancelPointerEvents: true })
            this.hotbar.addSlot(slot)
        }
        this.hotbar

        this.hotbar.setPosition(2.1, 1.1)
        this.getGame().mapGui.addComponent(this.hotbar)
        this.hotbar.getSlot(0).select()

    }
    createInventoryGui() {
        let leftOffset = .3
        this.InventorySlots = this.createInventorySlots()
        let InventoryContainer = new SlotCointainer().setSize(9, 4)
            .addSlotArray(this.InventorySlots)
            .setPosition(leftOffset, 3.9 + 0.9)

        //GUI for entire invetory window
        this.rootInventoryGui = new Gui().setName("rootInventory")
        this.getGame().mainGui.addComponent(this.rootInventoryGui, "main")
        //GUI for Inventory
        this.InventoryGui = new Gui(this.map.game)
            .setName("inventroy")
            .setDraggable()
            .setPosition(2, 0.6)
            .setFontSize(0.3)
            .setSize(9.5, 9)

            .addComponent(new BackGround().setDecoration(1).setParentSize())




        this.rootInventoryGui.addComponent(this.InventoryGui)



        this.InventoryGui.addComponent(InventoryContainer)

        this.craftingTableGui = new Gui()
            .setName("crafting table")

        this.InventoryGui.addComponent(this.craftingTableGui, "main")
        this.craftingTable = new CraftingTable()
        this.craftingTableGui.addComponent(this.craftingTable.getContainer().setPosition(leftOffset, 0.3))



        //backpacks gui
        this.createBackspacksGui()
        this.InventoryGui.addComponent(this.backpacksGui, "main")

        //machines gui
        this.createMachinesGui()
        this.InventoryGui.addComponent(this.machinesGui, "main")

        //adding left buttons

        let leftButtonIcons = [
            {
                icon: "craftingtablefront",
                gui: this.craftingTableGui
            },
            {
                icon: "smallbackpack",
                gui: this.backpacksGui
            },
            {
                icon: "gearGt",
                gui: this.machinesGui
            }

        ]
        let iter = 0
        for (const Pair of leftButtonIcons) {
            let y = 0.25 + 1.2 * iter
            let button = new Button()
            button.setPosition(-1, y)
                .setZLayer(-2)
                .setSize(1.32, 1)
                .setBackGround(getImg("buttonleft"))
                .setIcon(getImg(Pair.icon))

                .setDecoration("NO")


            button.close = () => {
                button.setZLayer(-2).setPosition(-1, y)
            }

            button.addAction(() => { Pair.gui.open(); button.open(); button.setPosition(-1.1, y).setZLayer(2) })
            this.InventoryGui.addComponent(button, "leftButton")
            if (iter == 0) {

                button.setPosition(-1.1, y).setZLayer(2)

            }


            iter++
        }


    }
    createMachinesGui() {
        this.machinesGui = new Gui().setName("machines")
        //creating container for backpacks
        let machineSelectionGui = new Gui().setName("bmachineSelection")
        this.machinesGui.addComponent(machineSelectionGui, "main")

        let container = new SlotCointainer()
            .setSize(9, this.machines.getSize() / 9)
            .setPosition(0.25, 0.2)
            .becomeEmptyExpandable()

        for (let i = 0; i < this.machines.getSize(); i++) {
            let slot = new Slot().setFilter((item) => item.getItem() instanceof classes.machine).setAdditionalInfo("R-Click to Open")
            slot.onPlace = () => {
                if (!slot.isEmpty()) {
                    // console.log("on placing")
                    slot.getItem().getItem().onPlace()
                    this.rootInventoryGui.addComponent(slot.getItem().getGui())
                    slot.getItem().getGui().setZLayer(100).setPosition(this.InventoryGui.position.add_vec(new Vector(3, 1))).close()
                    slot.getItem().getGui().backButton = closingButton()
                    slot.getItem().getGui().addComponent(slot.getItem().getGui().backButton)

                }
            }
            slot.onRemove = (oldItem) => {
                if (!oldItem.isEmpty()) {

                    oldItem.getItem().getItem().onRemove()
                    this.rootInventoryGui.removeComponent(oldItem.getItem().getGui())
                    // this.machinesGui.removeComponent(oldItem.getItem().getGui())
                    oldItem.getItem().getGui().removeComponent(oldItem.getItem().getGui().backButton)
                    //oldItem.getItem().getGui().removeComponent(slot.backButton)
                    delete slot.backButton
                }
            }
            slot.onRightClick = () => {
                if (!slot.isEmpty())
                    slot.getItem().getGui().open()
            }
            slot.setItem(this.machines.getItem(i)).build()
            container.addSlot(slot)

        }
        machineSelectionGui.addComponent(container)


    }

    createBackspacksGui() {
        this.backpacksGui = new Gui().setName("backpacks")
        //creating container for backpacks
        let backpacksSelectionGui = new Gui().setName("backpackSelection")
        this.backpacksGui.addComponent(backpacksSelectionGui, "main")
        let container = new SlotCointainer()
            .setSize(9, this.backpacks.getSize() / 9)
            .setPosition(0.25, 0.2)
            .becomeEmptyExpandable()
        for (let i = 0; i < this.backpacks.getSize(); i++) {
            let slot = new Slot().setFilter((item) => item.getItem() instanceof classes.backpack).setAdditionalInfo("R-Click to Open")
            slot.onPlace = () => {
                if (!slot.isEmpty()) {
                    this.rootInventoryGui.addComponent(slot.getItem().getGui())
                    slot.getItem().getGui().setZLayer(100).setPosition(this.InventoryGui.position.add_vec(new Vector(0, 1))).close()
                    slot.getItem().getGui().backButton = closingButton()
                    slot.getItem().getGui().addComponent(slot.getItem().getGui().backButton)

                }
            }
            slot.onRemove = (oldItem) => {
                if (!oldItem.isEmpty()) {

                    this.rootInventoryGui.removeComponent(oldItem.getItem().getGui())
                    oldItem.getItem().getGui().removeComponent(oldItem.getItem().getGui().backButton)
                    delete slot.backButton
                }
            }
            slot.onRightClick = () => {
                if (!slot.isEmpty())
                    slot.getItem().getGui().open()
            }
            slot.setItem(this.backpacks.getItem(i)).build()
            container.addSlot(slot)

        }
        backpacksSelectionGui.addComponent(container)

        return backpacksSelectionGui
    }

    createInventorySlots() {
        let slots = []
        for (let ItemStack of this.inventory.getAllInventory()) {
            slots.push(new Slot().setItem(ItemStack).build())
        }
        return slots
    }

}

export class Inventory {
    constructor(slots = 0) {
        this.inventory = []
        for (let i = 0; i < slots; i++) {
            this.inventory[i] = new ItemStack()
        }

    }
    getSize() {
        return this.inventory.length
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
    createTooltip() {
        let items = {}
        for (let itemStack of this.inventory) {
            if (items[itemStack.getName()]) {
                items[itemStack.getName()].count = items[itemStack.getName()].count + itemStack.getAmount()
            }
            else
                items[itemStack.getName()] = {
                    count: itemStack.getAmount(),
                    rarity: itemStack.getItem().getRarity()
                }

        }
        delete items.Empty
        let itemsArray = []
        for (const key in items) {
            itemsArray.push(`x${items[key].count} ` + TranslateName(key).color(getRarityColor(items[key].rarity)) + ",<br>")
        }

        return itemsArray.length ? "Contains: <br>" + itemsArray.join("").replace(/<br>(.*?)<br>/g, " $1<br>") : ""
    }

}