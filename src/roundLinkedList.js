
class Node {
    constructor(value) {
        this.value = value

    }
    getValue() { return this.value }
}

export default class roundLinkedList {
    constructor() {
        this.length = 0
    }
    addValuesArray(array) {
        for (let value of array) {
            this.addValue(value)
        }
        return this
    }
    addValue(value) {


        if (this.head) {
            let newNode = new Node(value)
            newNode.index = this.length
            this.tail.next = newNode
            newNode.prev = this.tail
            this.tail = newNode
            this.head.prev = this.tail
            this.tail.next = this.head
        } else {
            this.head = new Node(value)
            this.head.index = 0
            this.tail = this.head
            this.head.next = this.tail
            this.head.prev = this.tail
        }
        this.length++
        return this
    }
    getLength() {
        return this.length
    }
}