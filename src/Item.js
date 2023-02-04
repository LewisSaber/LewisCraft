import ItemStack from "./ItemStack.js"
import { BackGround } from "./gui/Background.js"
import Gui from "./gui/Gui.js"
import { Label } from "./gui/Label.js"
import OutputSlot from "./gui/OutputSlot.js"
import { Slot } from "./gui/Slot.js"
import { SlotCointainer } from "./gui/SlotContainer.js"
import { Inventory } from "./player.js"
import TranslateName from "./Translator.js"
import { FURNACE_RECIPE_MAP } from "./Recipes.js"
import ProgressBar from "./gui/Progressbar.js"
import { Vector } from "./math.js"
import { getImg } from "./utility.js"
console.log("initialised")


export let classes = {}

export function getDeprecatedName(name) {
    return DEPRECATED.get(name, name)
}
const DEPRECATED = {
    "Sand": "sand",
    "Stick": "stick",
    "Stone": "stone"
}




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


classes.stick = class stick extends classes.Item {
    constructor(amount) {
        super(amount)
    }
    getBurnValue() {
        return 100
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
        let width = Math.min(this.capacity, 9)
        let height = Math.ceil(this.capacity / 9)
        this.gui = new Gui().setName("backpackInside").setDraggable().setSize(width + 1, height + 0.8)
            .addComponent(new BackGround().setDecoration(1))

        let label = new Label().setPosition(0, 0.1).setText(TranslateName(this.name)).centerText().setFontSize(0.4)
        this.gui.addComponent(label)
        let container = new SlotCointainer().setSize(width, height).setPosition(0.5, 0.75)
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
        this.isPlaced = false
        this.isWorking = false
        this.progress = 0
        this.isStalled = false
        this.isSubscribedToTick = false
        this.subscribeFunc = () => { this.onTick() }
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
    stallMachine() {
        if (this.isStalled == false) {
            this.isStalled = true
            this.isWorking = false
            this.unsubscribeFromTick()
        }
    }
    unstallMachine() {
        this.isStalled = false
        this.subscribeToTick()
    }
    update() {

    }
    subscribeToTick() {
        if (!this.isSubscribedToTick) {
            this.isSubscribedToTick = true
            window.addEventListener("tick", this.subscribeFunc)
        }
    }
    unsubscribeFromTick() {
        if (this.isSubscribedToTick) {
            this.isSubscribedToTick = false
            window.removeEventListener("tick", this.subscribeFunc)
        }
    }
    onTick() {
        if (this.progress > 0) {
            this.progress--
        }
    }
    onPlace() {
        this.isPlaced = true
        this.update()
        this.unstallMachine()
    }
    onRemove() {
        this.isPlaced = false
        this.stallMachine()
    }
    save() {
        let saving = super.save()
        saving.isPlaced = this.isPlaced
        return saving
    }
}

classes.furnace = class furnace extends classes.machine {
    constructor(amount) {
        super(amount)
        this.input = new ItemStack()
        this.input.subscribeSlotToUpdate(() => { this.update() })

        this.fuel = new ItemStack()
        this.fuel.subscribeSlotToUpdate(() => { this.updateFuel() })

        this.output = new ItemStack()
        this.output.subscribeSlotToUpdate(() => { this.update() })

        this.recipeMap = FURNACE_RECIPE_MAP
        this.remainingFuel = 0

    }
    createGui() {
        this.gui = new Gui().setName("Furnace").setSize(4.3, 4).setDraggable().addComponent(new BackGround().setDecoration(1))
        let label = new Label().setPosition(0, 0.1).setText(TranslateName(this.name)).centerText().setFontSize(0.4)
        this.gui.addComponent(label)
        let labelOffset = 0.5

        let labelFuel = new Label().setPosition(0, labelOffset + 1.25).setText("Fuel").centerText().setFontSize(0.4)
        this.gui.addComponent(labelFuel)

        let inputContainer = new SlotCointainer().setSize(1, 1).setPosition(0.65, labelOffset + .3)
        let inputslot = new Slot().setItem(this.input).build()
        inputContainer.addSlot(inputslot)


        let outputContainer = new SlotCointainer().setSize(1, 1).setPosition(2.5 + .25, labelOffset + 0.3)
        let outputSlot = new OutputSlot().setItem(this.output).build()
        outputContainer.addSlot(outputSlot)


        let fuelContainer = new SlotCointainer().setSize(1, 1).setPosition(0.65, labelOffset + 2)
        let fuelSlot = new Slot().setItem(this.fuel).setFilter((itemStack) => itemStack.getItem().getBurnValue() > 0).build()
        fuelContainer.addSlot(fuelSlot)


        let fuelBarPosition = new Vector(1.8, labelOffset + 2.1)
        let fuelBarSize = new Vector(1.75, 0.7)
        this.fuelProgressBar = new ProgressBar().setMainColor("black").setPosition(fuelBarPosition).setSize(fuelBarSize).setMaxValue(this.remainingFuel).setProgressColor("linear-gradient(90deg, rgba(255,25,0,1) 0%, rgba(255,248,0,1) 100%)")
        this.gui.addComponent(new BackGround().setSize(fuelBarSize.add_vec(new Vector(.3, .3))).setPosition(fuelBarPosition.sub_vec(new Vector(0.15, 0.15))).setDecoration(1))


        this.progressBar = new ProgressBar().setPosition(1.62, labelOffset + .5).setSize(1, 0.5).setInverted().setDecoration(1).setProgressColor("white").setMaxValue(this.progress)
        this.gui.addComponent(this.progressBar)
        this.gui.addComponent(this.fuelProgressBar)
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
        saving.remainingFuel = this.remainingFuel
        saving.input = this.input.save()
        saving.output = this.output.save()
        saving.fuel = this.fuel.save()
        return saving
    }
    consumeFuel() {
        // console.log("consuming fuel")
        if (this.fuel.getItem().getBurnValue()) {
            this.remainingFuel += this.fuel.getItem().getBurnValue()
            this.fuel.decreaseAmount(1)
            if (this.fuelProgressBar)
                this.fuelProgressBar.setMaxValue(this.remainingFuel).update(this.remainingFuel)
        }
    }
    updateFuel() {
        this.unstallMachine()
    }

    stallMachine() {
        super.stallMachine()
        if (this.progressBar) {
            this.progressBar.update(0)
        }
    }

    update() {
        // console.log("updating", this.isWorking)
        if (!this.isWorking && this.isPlaced) {
            this.recipe = this.recipeMap.getRecipe(this.input)
            if (this.recipe) {
                if (this.output.canAdd(this.recipe.getOutput(0))) {
                    this.unstallMachine()
                    let time = this.recipe.getTime()
                    this.progress = time
                    if (this.progressBar)
                        this.progressBar.setMaxValue(time)
                    this.isWorking = true
                }
                else {
                    console.log("stalling at canAdd")
                    this.stallMachine()
                }
            }
            else {
                console.log("stalling at recipe")
                this.stallMachine()
            }
        }
        // else {
        //     console.log("stalling at working")
        //     this.stallMachine()
        // }


    }
    finishRecipe() {

        this.isWorking = false
        if (this.recipe.compareRecipe(this.input) && this.output.canAdd(this.recipe.getOutput(0))) {
            this.output.add(this.recipe.getOutput(0).copy())
            this.input.decreaseAmount(this.recipe.getInput(0).getAmount())
        }
        this.update()
    }

    onTick() {
        // console.log("tick")
        // console.log("remaining fuel", this.remainingFuel)
        if (this.progress) {
            if (!this.remainingFuel)
                this.consumeFuel()
            if (this.remainingFuel) {
                this.remainingFuel -= 1
                this.fuelProgressBar.update(this.remainingFuel)
                if (this.progressBar)
                    this.progressBar.update(this.progress)

                super.onTick()

                if (this.progress == 0) {
                    this.finishRecipe()
                }

            }
            else
                this.stallMachine()




        }
    }
}