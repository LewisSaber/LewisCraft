import { mergeObject } from "./utility.js"

export class Session {
    constructor(game) {
        this.game = game
        this.path = "session"
        this.data = {
            accounts: {},
            lastAccount: "",

        }
        this.load()
        // let len = Object.keys(this.data.accounts).length
        if (this.data.lastAccount == "") {

            let nick = prompt("Select Nickname") || "Steve"
            this.data.lastAccount = nick
            this.data.accounts[this.data.lastAccount] = {}
            this.data.accounts[this.data.lastAccount].nick = nick

        }
        this.saveProgress = 0
    }
    load() {
        let data = localStorage.getItem(this.path)
        // if (data == undefined) {
        //     this.createNewSession()
        // }
        if (data != null) {
            mergeObject(this.data, JSON.parse(data))
        }
    }
    getCurrentAccountPlayerInfo() {
        return this.data.accounts.get(this.data.lastAccount, {})
    }
    saveController() {
        this.saveProgress += 1
        if (this.saveProgress > 3) {
            this.save()
            this.saveProgress = 0
        }
    }
    save() {
        this.data.accounts[this.data.lastAccount] = game.map.player.save()
        localStorage.setItem(this.path, JSON.stringify(this.data))
    }
}