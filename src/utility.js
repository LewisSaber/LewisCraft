export function createEmptyArray(width, height) {
    let result = new Array(height)
    for (let i = 0; i < height; i++) {
        result[i] = new Array(width)
    }
    return result
}
console.log("initialised")
export class NumberRange {
    constructor(start = 0, end = 0) {
        this.start = start
        this.end = end
    }
    isNumberIn_inclusive(number) {
        return number >= this.start && number <= this.end
    }
    isNumberIn_exclusive(number) {
        return number >= this.start && number < this.end
    }

}
let next_id = 0
export function getUniqueIdentificator() {
    next_id++
    return next_id
}
/**
 * Will overwrite every property of original object with properties of pulling_from 
 * @example {a:2,b:7} + {b:9,c:6} => {a:2,b:9,c:6}
 * @param {Object} original 
 * @param {Object} pulling_from 
 * @returns 
 */
export function mergeObject(original, pulling_from) {
    if (original == undefined)
        original = pulling_from
    else
        for (const key in pulling_from) {
            if (pulling_from[key] instanceof Object) {
                if (original[key] == undefined)
                    original[key] = pulling_from[key]
                else
                    original[key] = mergeObject(original[key], pulling_from[key])
            }
            else
                original[key] = pulling_from[key]

        }
    return original
}
/** Reverses keys and items of  object */
export function reverseObject(object) {
    let result = {}
    for (const key in object) {
        result[object[key]] = key
    }
    return result
}

export function getImg(img, extension = "png") {
    return './src/assets/' + img + "." + extension
}
