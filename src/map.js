
const ASSETSFOLDER = "./src/assets/"
import { BackBuffer, MapBackBuffer, Sprite } from "./material.js"
import { map1 } from "./maps.js"
import { createEmptyArray, NumberRange } from "./utility.js"
import { Vector } from "./math.js"
import { Player } from "./player.js"
import { Chunk } from "./chunk.js"
import { Game } from "./game.js"

export class Map {
    constructor(gl, VS, FS, game) {
        this.gl = gl
        this.map = map1
        this.game = game
        this.player = new Player(ASSETSFOLDER + "player.png", gl, VS, FS, this)
        let buffers_size = 1024
        this.finalBuffer = new MapBackBuffer(this.gl, { width: buffers_size, height: buffers_size })
        this.midBuffer = new BackBuffer(this.gl, { width: buffers_size, height: buffers_size })
        this.entityBuffer = new MapBackBuffer(this.gl, { width: buffers_size, height: buffers_size })
        this.playerBuffer = new MapBackBuffer(this.gl, { width: buffers_size, height: buffers_size })
        this.VS = VS
        this.FS = FS
        this.zoom = 1
        this.zoomScale = 1
        this.chunkSize = 10
        this.renderedChunks = 0
        this.renderDistance = new Vector(1, 1)


        this.createSprites()
        this.splitLayers()
        this.splitToChunks()


    }
    getRenderDistance() {
        return this.renderDistance
    }
    getWidth() {
        return this.map?.at(0).length
    }
    getHeight() {
        return this.map?.length
    }
    getLayersAmount() {

        return Object.keys(this.layers).length
    }
    splitLayers() {
        this.layers = {
            0: createEmptyArray(this.getWidth(), this.getHeight()),
            1: createEmptyArray(this.getWidth(), this.getHeight()),

        }


        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                this.layers[0][i][j] = this.map[i][j][1]
                this.layers[1][i][j] = this.map[i][j][0]
            }
        }
    }
    splitToChunks() {

        let chunksize = this.chunkSize
        /**
         * @type {Chunk[][]}
         */
        this.chunks = createEmptyArray(this.getWidth() / chunksize >> 0, this.getHeight() / chunksize >> 0)
        for (let chunkI = 0; chunkI * chunksize < this.getHeight(); chunkI++) {
            for (let chunkJ = 0; chunkJ * chunksize < this.getWidth(); chunkJ++) {
                let chunk = new Chunk(this.gl, new Vector(chunksize, chunksize), this)
                for (let i = 0; i < chunksize; i++) {
                    for (let j = 0; j < chunksize; j++) {
                        chunk.setBlock(j, i, this.map[i + chunkI * chunksize][j + chunkJ * chunksize])

                    }
                }
                chunk.finish()
                this.chunks[chunkI][chunkJ] = chunk

            }
        }
    }
    resize(x, y) {
        let unscaledHeight = 10
        this.HeightInBlocks = 10//this.getHeight()
        this.WidthInBlocks = x / (y / this.HeightInBlocks)
        // if (this.WidthInBlocks < this.getWidth()) {
        //     this.WidthInBlocks = 30//this.getWidth()
        //     this.HeightInBlocks = this.WidthInBlocks * y / x
        // }
        this.zoomScale = this.HeightInBlocks / unscaledHeight

    }
    /**
     * get width of visible map(in blocks)
     */
    getBlocksWidth() {

        return this.WidthInBlocks /// this.getZoom()
    }
    /**
     * get height of visible map(in blocks)
     */
    getBlocksHeight() {
        return this.HeightInBlocks /// this.getZoom()
    }
    createSprites() {
        this.sprites = {}
        for (const row of this.map) {

            for (const column of row) {

                for (const block of column) {

                    if (block != "air")
                        if (this.game.sprites[block] == undefined) {
                            this.game.sprites[block] = new Sprite(this.gl, ASSETSFOLDER + block + ".png", this.VS, this.FS, { width: 1, height: 1 })
                        }

                }
            }
        }
    }
    addZoom(zoom) {

        this.zoom += zoom
    }
    setZoom(zoom) {
        this.zoom = zoom
    }
    getZoom() {
        return this.zoom * this.zoomScale
    }
    reRender() {


        // this.renderToBuffer()
    }
    test() {

    }


    /**
     * 
     * @param {Game} game 
     */
    render(game) {
        window.game.setBuffer(this.finalBuffer);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        let zoom = this.getZoom()

        let options = { scalex: zoom, scaley: zoom }


        // this.chunks[5][5].renderToBuffer()



        let wOffset = (this.player.coordinates.x / this.chunkSize >> 0) - this.getRenderDistance().x
        let hOffset = (this.player.coordinates.y / this.chunkSize >> 0) - this.getRenderDistance().y

        for (let i = 0; i < this.getRenderDistance().x * 2 + 1; i++) {
            options.x = ((wOffset + i) * this.chunkSize - this.player.coordinates.x + this.player.position.x) * game.getWidthMultiplier()

            for (let j = 0; j < this.getRenderDistance().y * 2 + 1; j++) {

                options.y = ((hOffset + j) * this.chunkSize - this.player.coordinates.y + this.player.position.y) * game.getHeightMultiplier()

                let chunk = this.chunks.get(j + hOffset, []).get(i + wOffset, undefined)
                if (chunk) {
                    window.game.setBuffer(this.finalBuffer);
                    chunk.render(options)

                }
                // this.chunks[j + hOffset][i + wOffset].render(options)

            }
        }


        this.player.render()
        window.game.setBuffer(this.game.finalBuffer);
        this.finalBuffer.render()
        this.entityBuffer.render({ scalex: zoom, scaley: zoom });
        window.game.setBuffer(this.entityBuffer)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)


    }
    async getFromFile(url) {

        let xhttp = new XMLHttpRequest()
        let promise = new Promise(function (resolve) {
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    //let text = atob(this.responseText)
                    let text = this.responseText
                    if (text != "") {
                        let map = JSON.parse(this.responseText)
                        resolve(map);
                    }

                }
            }
        })

        xhttp.open("Get", url, true)
        xhttp.send()
        return promise



    }
    unrenderChunks() {

        let wOffset = (this.player.coordinates.x / this.chunkSize >> 0) - this.getRenderDistance().x
        let hOffset = (this.player.coordinates.y / this.chunkSize >> 0) - this.getRenderDistance().y
        let xRange = new NumberRange(wOffset, wOffset + this.getRenderDistance().x * 2 + 1)
        let yRange = new NumberRange(hOffset, hOffset + this.getRenderDistance().y * 2 + 1)
        for (let i = 0; i < this.chunks.length; i++) {
            for (let j = 0; j < this.chunks[0].length; j++) {
                if (!xRange.isNumberIn_exclusive(j) || !yRange.isNumberIn_exclusive(i)) {
                    let chunk = this.chunks[i][j]
                    if (chunk.isRendered) {
                        chunk.unRender()
                    }
                }
            }
        }
    }
}