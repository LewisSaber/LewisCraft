import { BackBuffer, MapBackBuffer } from "./material.js";
import { Vector } from "./math.js";
import { createEmptyArray } from "./utility.js";


export class Chunk {
    constructor(gl, size, map) {
        this.gl = gl
        this.size = size
        this.map = map
        this.blocks = createEmptyArray(size.x, size.y)
        this.resolution = 32
        this.isRendered = false

    }
    toggleIsRender() {
        this.isRendered = !this.isRendered
    }
    unRender() {
        this.finalBuffer = undefined
        this.midBuffer = undefined
        this.isRendered = false
    }
    createBuffers() {
        this.midBuffer = new MapBackBuffer(this.gl, { width: this.size.x * this.resolution, height: this.size.y * this.resolution })
        this.finalBuffer = new MapBackBuffer(this.gl, { width: this.size.x * this.resolution, height: this.size.y * this.resolution })
    }
    setBlock(x, y, block) {
        this.blocks[y][x] = block
    }
    renderToBuffer() {

        if (this.finalBuffer == undefined)
            this.createBuffers()

        this.isRendered = true
        this.map.game.setBuffer(this.finalBuffer)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        let a = 0
        let darkModifier = 0.6
        for (let layer = 0; layer < 2; layer++) {
            this.map.game.setBuffer(this.midBuffer);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

            let options = { "u_color": layer == 0 ? [darkModifier, darkModifier, darkModifier, 1] : [1, 1, 1, 1] }
            for (let i = 0; i < this.size.y - a; i++) {
                for (let j = 0; j < this.size.x - a; j++) {
                    let toRender = this.layers[layer][i + a][j + a]
                    if (toRender != "air") {

                        this.map.game.sprites[toRender].render({ x: j, y: i }, options
                        )
                    }
                }

            }
            this.map.game.setBuffer(this.finalBuffer);
            this.midBuffer.render();
        }

        game.setBuffer(this.map.finalBuffer)
    }
    render(options = {}) {
        if (this.finalBuffer == undefined || !this.isRendered) {

            this.renderToBuffer()
        }
        this.finalBuffer.render(options)

    }
    splitLayers() {
        this.layers = {
            0: createEmptyArray(this.size.x, this.size.y),
            1: createEmptyArray(this.size.x, this.size.y),

        }


        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[i].length; j++) {
                this.layers[0][i][j] = this.blocks[i][j][1]
                this.layers[1][i][j] = this.blocks[i][j][0]
            }
        }
    }
    finish() {
        this.splitLayers()
        //this.renderToBuffer()
    }
}