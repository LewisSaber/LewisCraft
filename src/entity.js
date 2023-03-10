import { Map } from "./map.js";
import { Sprite } from "./material.js";
import { Vector } from "./math.js";

console.log("initialised")
export class Entity {
    constructor(img_url, size, gl, vs, fs, map) {
        this.coordinates = new Vector()

        this.size = size
        this.sprite = new Sprite(gl, img_url, vs, fs, { width: size.x, height: size.y })
        /** @type {Map} */
        this.map = map
    }
    getSprite() {
        return this.sprite
    }
    /**
     * get Player model width(in blocks)
     */
    getWidth() {
        return this.size.x
    }
    /**
     * get Player model heighs(in blocks)
     */
    getHeight() {
        return this.size.y
    }
    render(options = {}) {
        this.getSprite().render(this.coordinates.scale(this.map.getZoom()), options)
    }
    move(direction) {

        this.coordinates = this.coordinates.add_vec(direction)
        this.coordinates.x = +this.coordinates.x.toFixed(2)
        this.coordinates.y = +this.coordinates.y.toFixed(2)
    }
}