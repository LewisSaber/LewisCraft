import { Vector } from "../math.js"
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
        this.container.name = this.name
        this.container.style.backgroundSize = "100% 100%"
        this.container.style.imageRendering = "pixelated"
        this.container.style.position = "absolute"
        this.container.style.display = "none"
        this.container.style.pointerEvents = "none"
        this.container.disableContextMenu()
        return this
    }
    build() {
        if (this.size.x == 0 && this.size.y == 0)
            this.setParentSize()
        super.build()
        return this
    }
    decoration1(size, position) {

        let min = size.min() //Math.max(4 * this.getPixelSize().x, size.min())
        let s = Math.min(8, min * 0.03)
        let ss = s * 0.5
        let sss = s * 1.5

        return {
            top: `${position.y + sss}px`,
            left: `${position.x + sss}px`,
            'height': `${size.y - 2 * sss}`,
            'width': `${size.x - 2 * sss}px`,
            'background-color': ' #c6c6c6',
            'box-shadow': `${s}px 0 0 0 #555555, 0 ${s}px 0 0 #555555, ${ss}px ${ss}px 0 0 #555555, -${s}px 0 0 0 #e8e8e8, 0 -${s}px 0 0 #e8e8e8, -${ss}px -${ss}px 0 0 #e8e8e8, 0 0 0 ${ss}px #b5b4b5, ${ss}px ${s}px 0 0 #555, ${s}px ${ss}px 0 0 #555, -${ss}px -${s}px 0 0 #e8e8e8, -${s}px -${ss}px 0 0 #e8e8e8, ${s}px -${ss}px 0 0 #000, ${ss}px -${s}px 0 0 #000, -${s}px ${ss}px 0 0 #000, -${ss}px ${s}px 0 0 #000, -${s}px -${s}px 0 0 #000, ${s}px ${s}px 0 0 #000, -${sss}px 0 0 0 #000, -${sss}px -${ss}px 0 0 #000, ${sss}px 0 0 0 #000, ${sss}px ${ss}px 0 0 #000, 0 -${sss}px 0 0 #000, -${ss}px -${sss}px 0 0 #000, 0 ${sss}px 0 0 #000, ${ss}px ${sss}px 0 0 #000`
            // 'box-shadow': ` 8px 0 0 0 #555555, 
            // 0 8px 0 0 #555555, 4px 4px 0 0 #555555, -8px 0 0 0 #e8e8e8, 0 -8px 0 0 #e8e8e8, -4px -4px 0 0 #e8e8e8, 0 0 0 4px #b5b4b5, 4px 8px 0 0 #555, 8px 4px 0 0 #555, -4px -8px 0 0 #e8e8e8, -8px -4px 0 0 #e8e8e8, 8px -4px 0 0 #000, 4px -8px 0 0 #000, -8px 4px 0 0 #000, -4px 8px 0 0 #000, -8px -8px 0 0 #000, 8px 8px 0 0 #000, -12px 0 0 0 #000, -12px -4px 0 0 #000, 12px 0 0 0 #000, 12px 4px 0 0 #000, 0 -12px 0 0 #000, -4px -12px 0 0 #000, 0 12px 0 0 #000, 4px 12px 0 0 #000`
        }
    }



}