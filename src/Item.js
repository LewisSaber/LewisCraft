import Gui from "./gui/Gui.js"
import { Slot } from "./gui/Slot.js"
import { SlotCointainer } from "./gui/SlotContainer.js"
import ItemStack from "./ItemStack.js"
import { Inventory } from "./player.js"

export function getDeprecatedName(name) {
    return DEPRECATED.get(name, name)
}
const DEPRECATED = {
    "Sand": "sand",
    "Stick": "stick",
    "Stone": "stone"
}




export let classes = {}

export function getRarityColor(rarity) {
    return RarityColors.get(rarity, RarityColors[0])
}

const RarityColors = [
    "white",
    "lime",
    "#105ae3",
    "purple",
    "yellow"]
//     "#fc26a7",
//     "#6b0000",
//   ]

classes.Empty = class Empty {
    constructor(amount = 0) {
        this.name = this.constructor.name
        this.amount = amount
        this.maxStackSize = 64

    }
    /**
     * 
     * @returns How many items can fit in Stack
     */
    getEmpty() {
        return this.maxStackSize - this.amount
    }
    getRarity() {
        return 0
    }
    getBurnValue() {
        return 0
    }
    getType() {
        return "item"
    }
    onCopy() { }
    save() {
        return {
            name: this.name,
            amount: this.amount
        }
    }
    load() { }
    getAdditionalTooltip() {
        return ""
    }
}

classes.Block = class Block extends classes.Empty {
    constructor(amount) {
        super(amount)
    }
    getType() {
        return "block"
    }
}
classes.Item = class Item extends classes.Empty {
    constructor(amount) {
        super(amount)
    }
    getType() {
        return "item"
    }
}
classes.Stick = class Stick extends classes.Item {
    constructor(amount) {
        super(amount)
    }

}

classes.stick = class stick extends classes.Item {
    constructor(amount) {
        super(amount)
    }

}

classes.stone = class stone extends classes.Block {
    constructor(amount) {
        super(amount)
    }

}


classes.sand = class sand extends classes.Block {
    constructor(amount) {
        super(amount)

    }
    getRarity() {
        return 2
    }
}



classes.logoak = class logoak extends classes.Block {
    constructor(amount) {
        super(amount)
    }
}

classes.planksoak = class planksoak extends classes.Block {
    constructor(amount) {
        super(amount)
    }
}

classes.backpack = class backpack extends classes.Item {
    constructor(amount, capacity) {
        super(amount)
        this.maxStackSize = 1
        this.capacity = capacity
        this.inventory = new Inventory(capacity)
    }
    save() {
        let saving = super.save()
        saving.inventory = this.inventory.save()
        return saving
    }
    load(prop, obj) {
        switch (prop) {
            case "inventory":
                this.inventory.load(obj)
                break;

            default:
                break;
        }
    }
    createGui() {
        this.gui = new Gui().setName("backpackInside")
        let container = new SlotCointainer().setSize(9, Math.ceil(this.capacity / 9)).setPosition(0.25, 0.2)
        for (let ItemStack of this.inventory.getAllInventory()) {
            let slot = new Slot().setItem(ItemStack).build()
            container.addSlot(slot)

        }
        this.gui.addComponent(container)
        return this
    }
    getGui() {
        if (this.gui == undefined)
            this.createGui()
        return this.gui
    }
    getType() {
        return "Backpack"
    }
    getAdditionalTooltip() {
        let list = [
            `Capacity: ${this.capacity} Slots`,
            this.inventory.createTooltip()
        ]
        return list.join("<br>")
    }
    onCopy(Original) {
        for (let i = 0; i < this.inventory.getSize(); i++) {
            this.inventory.getItem(i).setItem(Original.inventory.getItem(i).copy().getItem())
            this.inventory.getItem(i).getItem().onCopy(Original.inventory.getItem())
        }
    }
}

classes.smallbackpack = class smallbackpack extends classes.backpack {
    constructor(amount) {
        let capacity = 9
        super(amount, capacity)
    }
    getRarity() {
        return 1
    }
}

classes.machine = class machine extends classes.Item {
    constructor(amount) {
        super(amount)
        this.input = new ItemStack()
        this.fuel = new ItemStack()
        this.output = new ItemStack()
    }
    getType() {
        return "Machine"
    }
    createGui() {
        this.gui = new Gui().setName("placeholder")
    }
    getGui() {
        if (!this.gui)
            this.createGui()
        return this.gui
    }

}

classes.furnace = class furnace extends classes.machine {
    constructor(amount) {
        super(amount)
    }
    createGui() {
        this.gui = new Gui().setName("Furance")

        let inputContainer = new SlotCointainer().setSize(1, 1)
        let inputslot = new Slot().setItem(this.input).build()
        inputContainer.addSlot(inputslot)

        let fuelContainer = new SlotCointainer().setSize(1, 1)
        let fuelSlot = new Slot().setItem(this.fuel).build()
        fuelContainer.addSlot(fuelSlot)

        let outputContainer = new SlotCointainer().setSize(1, 1).setPosition(5, 4)
        let outputSlot = new Slot().setItem(this.output).build()
        outputContainer.addSlot(outputSlot)

        this.gui.addComponent(inputContainer)
        this.gui.addComponent(fuelContainer)
        this.gui.addComponent(outputContainer)

    }
    load(prop, obj) {
        switch (prop) {
            case "input":
                this.input.load(obj)
                break;
            case "output":
                this.output.load(obj)
                break;

            case "fuel":
                this.fuel.load(obj)
                break;


            default:
                break;
        }
    }
    save() {
        let saving = super.save()
        saving.input = this.input.save()
        saving.output = this.output.save()
        saving.fuel = this.fuel.save()
        return saving
    }
}