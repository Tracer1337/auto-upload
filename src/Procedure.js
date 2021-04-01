const axios = require("axios").default
const MailAPI = require("./MailAPI")
const CloudAPI = require("./CloudAPI")
const Account = require("./Account")
const config = require("../config.json")
const { events } = require("./utils")

const VERIFICATION_LINK_REGEX = /https.*secure.*/g

class Procedure {
    constructor() {
        this.mailAPI = new MailAPI()
        this.cloudAPI = new CloudAPI()
    }

    async _register() {
        const address = await this.mailAPI.getAddress()
        const { password } = config

        if (!address) {
            throw new Error("Failed to receive email address")
        }

        const success = await this.cloudAPI.register(address, password)

        if (!success) {
            throw new Error("Failed to register")
        }

        const email = await this.mailAPI.awaitEmail()
        const link = email.bodyPlainText.match(VERIFICATION_LINK_REGEX)[0]

        await axios.get(link)

        const account = new Account(address, password)
        await account.store()

        return account
    }

    async _login(account) {
        const success = await this.cloudAPI.login(account.email, account.password)

        if (!success) {
            throw new Error("Failed to login")
        }
    }

    async run() {
        events.status("Register")
        const account = await this._register()

        events.status("Login")
        await this._login(account)
    }
}

module.exports = Procedure
