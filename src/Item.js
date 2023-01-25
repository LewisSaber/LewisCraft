
export let classes = {}


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
}
