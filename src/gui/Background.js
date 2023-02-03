import Gui from "./Gui.js"
export class BackGround extends Gui {
    constructor() {
        super()
    }
    setImg(img) {
        this.setBackGround(img)
        return this
    }
    createContainer() {
        this.container = document.createElement("div")
        this.container.style.backgroundSize = "100% 100%"
        this.container.style.imageRendering = "pixelated"
        this.container.style.position = "absolute"
        this.container.style.display = "none"
        this.container.disableContextMenu()
        return this
    }



}