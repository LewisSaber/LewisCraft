import { Game } from "./game.js"
import { BackGround } from "./gui/Background.js"
import { Button } from "./gui/Button.js"
import Gui from "./gui/Gui.js"
import { Label } from "./gui/Label.js"
import { Vector } from "./math.js"
import TranslateName, { TranslateKeyCode } from "./Translator.js"
import { reverseObject } from "./utility.js"

export default class OptionsController {
    constructor(game) {
        /** @type {Game}*/
        this.game = game

        this.createMainGui()
        this.createOptionButton()
        this.createGeneralTab()
        this.createControlsTab()

    }
    createMainGui() {
        this.mainGui = new Gui().setName("options").setPosition(1, 0.95)
        this.game.mainGui.addComponent(this.mainGui, "main")

        let OptionsBackGround = new BackGround()
            .setImg("./src/assets/background.png")
            .setSize(15, 8.5)

        this.mainGui.addComponent(OptionsBackGround)

    }
    getPlayer() {
        return this.game.getPlayer()
    }
    createOptionButton() {
        let settingsButton = new Button()
            .setName("optionsButton")
            .setSize(1, 1)
            .setPosition(1.2, 1.2)
            .addAction(() => { this.mainGui.open() })
            .positionFromButtom()
            .positionFromRight()
            .setIcon("./src/assets/settings.png")
        this.game.mapGui.addComponent(settingsButton)
    }
    createGeneralTab() {
        this.generalTabButton = new Button().setSize(3, 1).setDecoration(1).setFontSize(0.7).setText("shit")
        this.mainGui.addComponent(this.generalTabButton)
        this.generalTab = new Gui().setName("optionsGeneral").setPosition(0, 1)
        this.mainGui.addComponent(this.generalTab, "main")
        let languageLabel = new Label().setText("Select language").setFontSize(0.3).setPosition(0.3, 0.3)
        this.generalTab.addComponent(languageLabel)

    }
    createControlsTab() {
        this.controlsTabButton = new Button()
            .setPosition(3, 0)
            .setSize(5, 1)
            .setDecoration(1)
            .setFontSize(0.6)
            .setText("Controls")
        this.mainGui.addComponent(this.controlsTabButton)
        this.controlsTabButton.addAction(() => { this.controlsGui.open() })
        this.controlsGui = new Gui()
            .setName("optionsControls")
            .setPosition(0, 1)
        this.mainGui.addComponent(this.controlsGui, "main")

        let keyBinds = this.game.getPlayer().getKeyBinds()

        let i = 0
        let listeningActive = false
        for (const key in keyBinds) {
            let labelControll = new Label().setText(TranslateName(key)).setFontSize(0.3).setPosition(0.3, 0.3 + i * 0.6)
            this.controlsGui.addComponent(labelControll)
            let button = new Button().setText(TranslateKeyCode(keyBinds[key])).setFontSize(0.3).setSize(2.5, .5).setPosition(3.6, 0.25 + i * 0.6)
                .addAction(() => {

                    if (listeningActive == false) {
                        listeningActive = true
                        button.setText("")
                        document.addEventListener("keydown", ({ code }) => { this.setKeyBind(code, key, button); listeningActive = false; }, { once: true })
                    }
                })
            this.controlsGui.addComponent(button)
            i++
        }

    }
    setKeyBind(code, action, button) {
        let blacklist = ["Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9",
            "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Escape"]
        //passing filter
        if (blacklist.includes(blacklist)) {
            code = "none"
        }
        let keyBinds = this.game.getPlayer().addKeyBind(code, action)
        button.setText(TranslateKeyCode(code))



    }
}