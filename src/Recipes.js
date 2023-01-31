import ItemStack from "./ItemStack.js"


export class CraftingRecipeMap {
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
}
export const CRAFTING_RECIPE_MAP = new CraftingRecipeMap()


export class RecipeBase {
    constructor() {
        /** @type {ItemStack[]} */
        this.inputs = []
        /** @type {ItemStack[]} */
        this.outputs = []
        this.stringedInputs = {}
        this.shiftedInputs = []
    }
    addInputItem(item, count) {
        this.inputs.push(new ItemStack(item, count))
        return this
    }
    addInputItemStack(ItemStack) {
        this.inputs.push(ItemStack.copy())
        return this
    }
    addOutputItemStack(ItemStack) {
        this.outputs.push(ItemStack.copy())
        return this
    }
    addLetterItem(letter, item, count) {
        this.stringedInputs[letter] = new ItemStack(item, count)
        return this
    }
    addLetterItemStack(letter, ItemStack) {
        this.stringedInputs[letter] = ItemStack
        return this
    }
    addOutputItem(item, count) {
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
        if (this.recipeString)
            this.recipeString += " ".repeat(9 - this.recipeString.length)
        for (let letter of this.recipeString) {
            if (letter == " ") {
                this.inputs.push(new ItemStack())
            } else {
                this.inputs.push(this.stringedInputs[letter].copy())
            }
        }
        this.shiftInput()
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
    getShiftedInput(i) {
        return this.shiftedInputs[i]
    }
}

export class ShapedRecipe extends RecipeBase {
    constructor() {
        super()
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
    build() {
        super.build()
        CRAFTING_RECIPE_MAP.addShapedRecipe(this)
        return this
    }
}

new ShapedRecipe().addString("    l    ").addLetterItem("l", "logoak", 1).addOutputItem("planksoak", 4).build()
new ShapedRecipe().addString("    p  p ").addLetterItem("p", "planksoak", 1).addOutputItem("stick", 4).build()