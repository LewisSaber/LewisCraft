import { BackGround } from "./src/gui/Background.js"
import { Button } from "./src/gui/Button.js"
import Gui from "./src/gui/Gui.js"
import { Label } from "./src/gui/Label.js"
import { classes } from "./src/Item.js"
import roundLinkedList from "./src/roundLinkedList.js"
import { getImg, getUniqueIdentificator } from "./src/utility.js"



export default class NEI {
    constructor(game) {
        this.game = game
        this.createGui()
        this.handlers = {}


    }
    createGui() {
        this.gui = new Gui().setName("NEI").setSize(10, 8).setPosition(1, 1).addComponent(new BackGround().setDecoration(1))
        this.game.mainGui.addComponent(this.gui, "main")
    }
    showRecipe(Item) {
        let recipes = {}
        for (const handler in this.handlers) {
            recipes[handler] = {
                icon: this.handlers[handler].icon,
                recipes: this.handlers[handler].handler.getRecipeForNEI(Item.getName())
            }
            if (recipes[handler].recipes.length == 0)
                delete recipes[handler]

        }
        this.showRecipes(recipes)
    }
    showUsage(Item) {
        let recipes = {}
        for (const handler in this.handlers) {
            recipes[handler] = {
                icon: this.handlers[handler].icon,
                recipes: this.handlers[handler].handler.getUsageForNEI(Item.getName())
            }
            if (recipes[handler].recipes.length == 0)
                delete recipes[handler]

        }
        this.showRecipes(recipes)
    }

    showRecipes(recipes) {
        if (Object.keys(recipes).length == 0)
            return

        this.game.getCursor().clearTooltip()

        this.recipes = recipes

        //removing old gui
        for (const component in this.gui.components.main) {
            this.gui.close()
            this.gui.removeComponent(this.gui.components.main[component])
        }
        for (const component in this.gui.components.topButton) {
            this.gui.removeComponent(this.gui.components.topButton[component])
        }



        let iter = 0
        for (const handler in this.recipes) {
            let recipeHandler = this.recipes[handler]


            recipeHandler.recipes = new roundLinkedList().addValuesArray(recipeHandler.recipes)
            recipeHandler.pointer = recipeHandler.recipes.head

            recipeHandler.gui = new Gui().setParentSize()
            this.gui.addComponent(recipeHandler.gui, "main")


            do {
                recipeHandler.gui.addComponent(recipeHandler.pointer.getValue().getGui().positionCenter(), "main")
                recipeHandler.pointer = this.recipes[handler].pointer.next
            } while (recipeHandler.pointer.index != 0);


            //creating counter for amount of recipes
            recipeHandler.countLabel = new Label().setText(recipeHandler.pointer.index + 1 + "/" + recipeHandler.recipes.getLength()).centerText().setFontSize(0.5).setPosition(0, 0.1)
            recipeHandler.gui.addComponent(recipeHandler.countLabel)
            //creating buttons to move between recipes
            let buttonRight = new Button().setSize(1, 0.7).setText(">", undefined, undefined, 0, 0).positionFromRight().setPosition(1.5, 0.3).setFontSize(0.5)
            buttonRight.addAction(() => {
                recipeHandler.pointer = recipeHandler.pointer.next
                recipeHandler.pointer.getValue().getGui().open()
                recipeHandler.countLabel.setText(recipeHandler.pointer.index + 1 + "/" + recipeHandler.recipes.getLength())
            })
            recipeHandler.gui.addComponent(buttonRight)

            let buttonLeft = new Button().setSize(1, 0.7).setText("<", undefined, undefined, 0, 0).setPosition(.5, 0.3).setFontSize(0.5)
            buttonLeft.addAction(() => {
                recipeHandler.pointer = recipeHandler.pointer.prev
                recipeHandler.pointer.getValue().getGui().open()
                recipeHandler.countLabel.setText(recipeHandler.pointer.index + 1 + "/" + recipeHandler.recipes.getLength())
            })
            recipeHandler.gui.addComponent(buttonLeft)



            //creating button on top
            let x = 0.25 + 1.2 * iter
            let button = new Button()
            button.setPosition(x, -0.9)
                .setZLayer(-2)
                .setSize(1, 1.2)
                .setBackGround(getImg("buttonTop"))
                .setIcon(this.recipes[handler].icon)
                .setDecoration("NO")


            button.close = () => {
                button.setZLayer(-2).setPosition(x, -0.9)
            }
            button.addAction(() => { recipeHandler.gui.open(); button.open(); button.setPosition(x, -1).setZLayer(2) })

            recipeHandler.button = button
            this.gui.addComponent(button, "topButton")
            if (iter == 0) {

                button.setPosition(x, -1).setZLayer(2)

            }


            iter++
        }


        let handlersList = new roundLinkedList()
        handlersList.addValuesArray(Object.keys(recipes))
        this.handlerPointer = handlersList.head


        this.gui.open()
    }

    registerHandler(handler, icon) {
        this.handlers[getUniqueIdentificator()] = {
            handler, icon
        }
        return this
    }
}