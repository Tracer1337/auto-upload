const axios = require("axios").default
const fs = require("fs")
const crypto = require("crypto")
const MailAPI = require("./MailAPI")
const CloudAPI = require("./CloudAPI")
const Account = require("./Account")
const config = require("../config.json")
const { events } = require("./utils")

const VERIFICATION_LINK_REGEX = /https.*secure.*/g
const MEGABYTE = 10 ** 6

class Procedure {
    constructor(account) {
        this.account = account
        this.mailAPI = new MailAPI()
        this.cloudAPI = new CloudAPI()
    }

    async _register() {
        const address = await this.mailAPI.getAddress()
        const { password } = config

        if (!address) {
            throw "Failed to receive email address"
        }

        const success = await this.cloudAPI.register(address, password)

        if (!success) {
            throw "Failed to register"
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
            throw "Failed to login"
        }
    }

    async _uploadFile() {
        const buffer = crypto.randomBytes(config.uploadFileSizeMB * MEGABYTE)
        const stream = fs.ReadStream.from(buffer)
        stream.path = config.uploadFileName
        const success = await this.cloudAPI.upload(stream)

        if (!success) {
            throw "Failed to upload file"
        }
    }

    async run() {
        if (!this.account) {
            events.status("Register")
            this.account = await this._register()
        }

        events.status("Login")
        await this._login(this.account)

        events.status("Upload File")
        await this._uploadFile()
    }
}

module.exports = Procedure
