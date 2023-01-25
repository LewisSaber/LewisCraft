export function createEmptyArray(width, height) {
    let result = new Array(height)
    for (let i = 0; i < height; i++) {
        result[i] = new Array(width)
    }
    return result
}

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