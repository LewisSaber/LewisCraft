import { BackBuffer } from "./material.js";
import { M3x3, Vector } from "./math.js"
import { Map } from "./map.js"
import Cursor from "./cursor.js";
import { Session } from "./Session.js";
import OptionsController from "./Options.js";
import Gui from "./gui/Gui.js";
import { BackGround } from "./gui/Background.js";
import { loadRecipes, registerRecipeHandlers } from "./Recipes.js"
import { getImg } from "./utility.js";
import NEI from "../Nei.js";
import roundLinkedList from "./roundLinkedList.js";

console.log("initialised")
export function loop(time) {

    window.game.update(time)
    requestAnimationFrame(loop)
}


export class Game {
    constructor() {
        loadRecipes()
        this.canvasElm = document.createElement("canvas")
        this.canvasElm.disableContextMenu()
        this.canvasElm.width = 800
        this.canvasElm.height = 600
        this.options = {}
        this.sprites = {}


        this.gl = this.canvasElm.getContext("webgl2", { preserveDrawingBuffer: true })
        this.gl.clearColor(0.4, 0.6, 1.0, 0.0)


        document.body.appendChild(this.canvasElm)
        let vs = document.getElementById("vs_01").innerHTML
        let fs = document.getElementById("fs_01").innerHTML

        this.backBuffer = new BackBuffer(this.gl, { width: 8192, height: 8192 })
        this.finalBuffer = new BackBuffer(this.gl, { width: 8192, height: 8192 })

        this.session = new Session(this)


        this.mainGui = new Gui().setParentSize().setHeight(12).setFontSize(0.3).build()
        this.mainGui.open()
        this.createMapGui()

        document.getElementById("body").appendChild(this.mainGui.getContainer())

        this.map = new Map(this.gl, vs, fs, this)


        //  this.mainGui.addComponent(new BackGround().setBackGround(getImg("stone")).setPosition(1, 1).setSize(4, 4).addComponent(new BackGround().setSize(4, 4).setImg(getImg("background"))))
        this.lastFrame = 0
        this.lastSecond = 0
        this.lastTick = 0

        this.cursor = new Cursor(this)

        this.optionController = new OptionsController(this)
        this.NEI = new NEI(this)
        registerRecipeHandlers(this.NEI)

    }
    getNEI() {
        return this.NEI
    }

    onSecond() {
        this.map.unrenderChunks()
        this.session.saveController()
    }
    onTick() {
        window.dispatchEvent(new CustomEvent("tick"))
    }

    update(time) {
        let ms = time - this.lastFrame
        this.lastFrame = time
        let delta = ms / 1000

        this.map.player.update(delta)
        if (time / 1000 >> 0 > this.lastSecond) {

            this.lastSecond = time / 1000 >> 0
            this.onSecond()
        }
        if (time / 50 >> 0 > this.lastTick) {
            this.lastTick = time / 50 >> 0
            this.onTick()
        }



        this.gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height)
        // this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        this.gl.enable(this.gl.BLEND)
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

        this.map.render(this)
        this.setBuffer()
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.finalBuffer.render()
        this.setBuffer(this.finalBuffer)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.flush()


        this.cursor.update()

    }
    setBuffer(buffer, options = {}) {
        options = this.options
        let gl = this.gl;
        if (buffer instanceof BackBuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer.fbuffer);
            gl.viewport(options.get("x", 0), options.get("x", 0), buffer.size.x, buffer.size.y);
            //gl.clear(gl.COLOR_BUFFER_BIT);
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height);
        }
    }

    resize(x, y) {
        this.mainGui.computeSize().resize()
        this.cursor.resize()
        this.canvasElm.width = x
        this.canvasElm.height = y
        this.map.resize(x, y)
        this.worldSpaceMatrix = new M3x3().transition(-1, 1).scale(2 / this.map.WidthInBlocks, -2 / this.map.HeightInBlocks)
        this.map.reRender()
    }
    getWidthMultiplier() {
        return 2 / this.map.WidthInBlocks
    }
    getHeightMultiplier() {
        return -2 / this.map.HeightInBlocks
    }
    /**
     * 
     * @returns {Player}
     */
    getPlayer() {
        return this.map.player
    }
    createMapGui() {

        this.mapGui = new Gui(this)
            .setName("map")
            .setParentSize()
            .addComponent(new BackGround().setImg("./src/assets/background.png").setPosition(1.75, 1.2).setSize(9.5, 1.2).positionFromButtom(), "none")

        this.mainGui.addComponent(this.mapGui, "main")

    }
    getCursor() {
        return this.cursor
    }
}