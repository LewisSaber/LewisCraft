import { Game, loop } from "./game.js";
import ItemStack from "./ItemStack.js";



HTMLElement.prototype.setSize = function (sizeVector, type = "px") {

    this.style.width = sizeVector.x + type
    this.style.height = sizeVector.y + type
}
HTMLElement.prototype.setPosition = function (pozitionVector, type = "px") {
    this.style.left = pozitionVector.x + type
    this.style.top = pozitionVector.y + type
}
HTMLElement.prototype.setBackgroundImage = function (url) {

    this.style.backgroundImage = url == "none" ? url : `url(${url})`
}
HTMLElement.prototype.setZLayer = function (layer) {
    this.style.zIndex = layer
}
HTMLElement.prototype.disablePointerEvents = function () {
    this.style.pointerEvents = "none"
}
HTMLElement.prototype.disableContextMenu = function () {
    this.oncontextmenu = () => false
}
HTMLElement.prototype.applyStyle = function (style) {
    if (style instanceof Object)

        for (const key in style) {
            this.style.setProperty(key, style[key])
        }
    else {
        console.warn("applying bad style", style)
    }

}

String.prototype.color = function (color) {
    let elem = document.createElement("span")
    elem.style.color = color
    elem.innerHTML = this
    return elem.outerHTML
}

String.prototype.capitalize = function () {

    return this[0].toUpperCase() + this.substring(1)
}


Object.defineProperty(Object.prototype, 'get', {
    value: function (key, default_value = 0) {
        return this[key] || default_value
    },
    enumerable: false, // this is actually the default
});

window.addEventListener("load", function () {
    window.game = new Game()

    window.game.resize(
        window.innerWidth, window.innerHeight
    )
    setTimeout(function () {

        loop(0)
        window.game.map.reRender()
    }, 500)


})
window.addEventListener("resize", function () {
    window.game.resize(
        window.innerWidth, window.innerHeight
    )
})

window.addEventListener("mousedown", (e) => { window.g = e })


function give(item, quantity = 1) {
    let itemS = new ItemStack(item, quantity)
    window.game.getPlayer().inventory.add(itemS)
}
window.give = give


