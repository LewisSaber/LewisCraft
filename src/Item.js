
export let classes = {}

export function getRarityColor(rarity) {
    return RarityColors.get(rarity, RarityColors[0])
}

const RarityColors = [
    "white",
    "lime",
    "#105ae3",
    "purple",
    "yellow"]
//     "#fc26a7",
//     "#6b0000",
//   ]

classes.Empty = class Empty {
    constructor(amount = 0) {
        this.name = this.constructor.name
        this.amount = amount
        this.maxStackSize = 64

    }
    /**
     * 
     * @returns How many items can fit in Stack
     */
    getEmpty() {
        return this.maxStackSize - this.amount
    }
    getRarity() {
        return 0
    }
    getBurnValue() {
        return 0
    }
    getType() {
        return "item"
    }
    onCopy() { }
    save() {
        return {
            name: this.name,
            amount: this.amount
        }
    }
}

classes.Block = class Block extends classes.Empty {
    constructor(amount) {
        super(amount)
    }
    getType() {
        return "block"
    }
}
classes.Item = class Item extends classes.Empty {
    constructor(amount) {
        super(amount)
    }
    getType() {
        return "item"
    }
}
classes.Stick = class Stick extends classes.Item {
    constructor(amount) {
        super(amount)
    }

}

classes.Stone = class Stone extends classes.Block {
    constructor(amount) {
        super(amount)
    }

}

classes.Sand = class Sand extends classes.Block {
    constructor(amount) {
        super(amount)
    }
    getRarity() {
        return 2
    }
}
