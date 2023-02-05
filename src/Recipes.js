import { CraftingTable } from "./CraftingTable.js"
import { classes } from "./Item.js"
import ItemStack from "./ItemStack.js"
import { getImg } from "./utility.js"



console.log("initialised")

class CraftingRecipeMap {
    constructor() {
        this.shapelessRecipes = []
        this.shapedRecipes = []
    }
    addShapedRecipe(recipe) {
        this.shapedRecipes.push(recipe)
    }
    getRecipe(ItemStack_array) {

        for (let recipe of this.shapedRecipes) {
            if (recipe.compareRecipe(ItemStack_array))
                return recipe
        }
    }
    getUsageForNEI(itemName) {
        let foundRecipes = []
        for (let recipe of this.shapedRecipes) {
            for (let i = 0; i < 9; i++) {
                if (recipe.getInput(i).getName() == itemName) {
                    foundRecipes.push(recipe)

                    i = 9
                }
            }
        }
        let craftingTables = []
        for (let recipe of foundRecipes) {
            let table = new CraftingTable().loadRecipe(recipe)
            craftingTables.push(table)
        }
        return craftingTables
    }
    getRecipeForNEI(itemName) {
        let foundRecipes = []
        for (let recipe of this.shapedRecipes) {
            if (recipe.getOutput(0).getName() == itemName) {
                foundRecipes.push(recipe)

            }
        }

        let craftingTables = []
        for (let recipe of foundRecipes) {
            let table = new CraftingTable().loadRecipe(recipe)
            craftingTables.push(table)
        }
        return craftingTables
    }
}

class FurnaceRecipeMap {
    constructor() {
        this.recipes = []

    }
    addRecipe(recipe) {
        this.recipes.push(recipe)
    }
    getRecipe(ItemStack) {

        for (let recipe of this.recipes) {
            if (recipe.compareRecipe(ItemStack))
                return recipe
        }
    }

    getUsageForNEI(itemName) {
        let foundRecipes = []
        for (let recipe of this.recipes) {
            if (recipe.getInput(0).getName() == itemName) {
                foundRecipes.push(recipe)
            }
        }

        let furnaces = []
        for (let recipe of foundRecipes) {
            let furnace = new classes.furnace().loadRecipe(recipe)
            furnaces.push(furnace)
        }
        return furnaces
    }

    getRecipeForNEI(itemName) {
        let foundRecipes = []
        for (let recipe of this.recipes) {
            if (recipe.getOutput(0).getName() == itemName) {
                foundRecipes.push(recipe)
            }
        }

        let furnaces = []
        for (let recipe of foundRecipes) {
            let furnace = new classes.furnace().loadRecipe(recipe)
            furnaces.push(furnace)
        }
        return furnaces
    }
}


export const CRAFTING_RECIPE_MAP = new CraftingRecipeMap()
export const FURNACE_RECIPE_MAP = new FurnaceRecipeMap()

export class RecipeBase {
    constructor() {
        /** @type {ItemStack[]} */
        this.inputs = []
        /** @type {ItemStack[]} */
        this.outputs = []
        this.stringedInputs = {}

    }
    addInputItem(item, count = 1) {
        this.inputs.push(new ItemStack(item, count))
        return this
    }
    addInputItemStack(Item_Stack) {
        this.inputs.push(Item_Stack.copy())
        return this
    }
    addOutputItemStack(Item_Stack) {
        this.outputs.push(Item_Stack.copy())
        return this
    }
    addLetterItem(letter, item, count = 1) {
        this.stringedInputs[letter] = new ItemStack(item, count)
        return this
    }
    addLetterItemStack(letter, Item_Stack) {
        this.stringedInputs[letter] = Item_Stack
        return this
    }
    addOutputItem(item, count = 1) {
        this.outputs.push(new ItemStack(item, count))
        return this
    }
    compareRecipe() {
        return false
    }
    addString(string) {
        this.recipeString = string
        return this
    }

    build() {
        if (this.recipeString) {
            this.recipeString += " ".repeat(9 - this.recipeString.length)
            for (let letter of this.recipeString) {
                if (letter == " ") {
                    this.inputs.push(new ItemStack())
                } else {
                    this.inputs.push(this.stringedInputs[letter].copy())
                }
            }
        }
        this.recipeString = undefined
        this.stringedInputs = undefined
        return this
    }
    getOutput(i) {
        return this.outputs[i]
    }
    getInput(i) {
        return this.inputs[i]
    }
    compareRecipe(ItemStack_array) {
        return false
    }

}

export class FuranceRecipe extends RecipeBase {
    constructor() {
        super()
        this.time = 0
    }
    addTime(timeInTicks) {
        this.time = timeInTicks
        return this
    }
    getTime() {
        return this.time
    }
    build() {
        super.build()
        FURNACE_RECIPE_MAP.addRecipe(this)
        return this
    }
    compareRecipe(Item_Stack) {
        if (!this.inputs[0].isSame(Item_Stack)) {
            return false
        }
        if (this.inputs[0].getAmount() > Item_Stack.getAmount()) {
            return false
        }
        return true
    }

}

export class ShapedRecipe extends RecipeBase {
    constructor() {
        super()

        this.shiftedInputs = []
    }
    getShiftedInput(i) {
        return this.shiftedInputs[i]
    }

    shiftInput() {
        let topShift = 0
        if (this.inputs[0].isEmpty() && this.inputs[1].isEmpty() && this.inputs[2].isEmpty()) {
            topShift++
            if (this.inputs[3].isEmpty() && this.inputs[4].isEmpty() && this.inputs[5].isEmpty())
                topShift++
        }
        let leftShift = 0
        if (this.inputs[0].isEmpty() && this.inputs[3].isEmpty() && this.inputs[6].isEmpty()) {
            leftShift++
            if (this.inputs[1].isEmpty() && this.inputs[4].isEmpty() && this.inputs[7].isEmpty())
                leftShift++
        }
        for (let i = 0; i < 9; i++) {
            this.shiftedInputs[(i - topShift * 3 - leftShift + 9) % 9] = this.inputs[i]
        }

    }
    build() {
        super.build()
        this.shiftInput()
        CRAFTING_RECIPE_MAP.addShapedRecipe(this)
        return this
    }
    compareRecipe(ItemStack_array) {

        for (let i = 0; i < this.shiftedInputs.length; i++) {
            if (!this.shiftedInputs[i].isSame(ItemStack_array[i])) {
                return false
            }
            if (this.shiftedInputs[i].getAmount() > ItemStack_array[i].getAmount()) {
                return false
            }
        }
        return true
    }
}

export function registerRecipeHandlers(NEI) {
    NEI.registerHandler(CRAFTING_RECIPE_MAP, getImg('craftingtablefront'))
    NEI.registerHandler(FURNACE_RECIPE_MAP, getImg('furnace'))
}

export function loadRecipes() {
    new ShapedRecipe().addString("    l    ").addLetterItem("l", "logoak", 1).addOutputItem("planksoak", 4).build()
    new ShapedRecipe().addString("    p  p ").addLetterItem("p", "planksoak", 1).addOutputItem("stick", 4).build()
    new ShapedRecipe().addString("s  p").addLetterItem("s", "stick", 2).addLetterItem("p", "planksoak", 3).addOutputItem("furnace", 1).build()




    new FuranceRecipe().addInputItem("planksoak").addOutputItem("stick", 4).addTime(100).build()
    new FuranceRecipe().addInputItem("stick", 2).addOutputItem("stone", 4).addTime(100).build()
}
