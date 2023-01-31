import GUIComponent from "./GUIComponent.js"
export class BackGround extends GUIComponent {
    constructor() {
        super()
    }
    setImg(url) {
        this.img = url
        return this
    }
    createContainer() {
        this.container = document.createElement("div")
        this.container.style.backgroundSize = "100% 100%"
        this.container.style.imageRendering = "pixelated"
        this.container.style.position = "absolute"
        return this
    }
    resize() {
        let pixelsize = this.getPixelSize()
        this.container.setSize(this.size.multiply(pixelsize))
        this.container.setPosition(this.position.multiply(pixelsize))
    }

    build() {
        super.build()
        this.container.setBackgroundImage(this.img)
        return this
    }

}