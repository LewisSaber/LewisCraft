import { BackGround } from "./gui/background.js"
import { Button } from "./gui/Button.js"
import Gui from "./gui/Gui.js"
import { Label } from "./gui/Label.js"
import { Vector } from "./math.js"

export default class OptionsController {
    constructor(game) {
        this.game = game

        this.createMainGui()
        this.createOptionButton()
        this.createGeneralTab()
        this.generalTab.open()
    }
    createMainGui() {
        this.mainGui = new Gui().setName("options").setPosition(new Vector(1, 0.95))
        this.game.mainGui.addGui(this.mainGui, "main")

        let OptionsBackGround = new BackGround()
            .setImg("./src/assets/background.png")
            .setSize(new Vector(15, 8.5))
            .build()
        this.mainGui.addBackground(OptionsBackGround)

    }
    getPlayer() {
        return this.game.getPlayer()
    }
    createOptionButton() {
        let settingsButton = new Button()
            .setSize(new Vector(1, 1))
            .setPosition(new Vector(1.2, 1.2))
            .addAction(() => { this.mainGui.open() })
            .setIcon("./src/assets/settings.png").build()
        this.game.mapGui.addComponent(settingsButton, { fromBottom: true, fromRight: true })
    }
    createGeneralTab() {
        this.generalTabButton = new Button().setSize(new Vector(3, 1)).setDecoration(1).setFontSize(0.7).setText("shit").build()
        this.mainGui.addComponent(this.generalTabButton)
        this.generalTab = new Gui().setPosition(new Vector(0, 1))
        this.mainGui.addGui(this.generalTab, "main")
        let languageLabel = new Label().setText("Select language").setFontSize(0.3).setPosition(new Vector(0.3, 0.3))
        this.generalTab.addComponent(languageLabel)
    }
}
/*  let OptionsBackGround = new BackGround()
            .setImg("./src/assets/background.png")
            .setSize(new Vector(2, 3))
            .build()

        this.optionGui = new Gui()
            .setPosition(new Vector(1, 1))
            .setName("options")
            .addBackground(OptionsBackGround)

        this.getGame().mainGui.addGui(this.optionGui, "main")
        let testLabel = new Label().setText("Test").setPosition(new Vector(2, 2)).build()
        this.optionGui.addComponent(testLabel)

        let selector = new Selector().setSize(new Vector(1, 0.5)).setPosition(new Vector(4, 4)).addOption(new Option("Why", "Tho")).build()
        this.optionGui.addComponent(selector)*/