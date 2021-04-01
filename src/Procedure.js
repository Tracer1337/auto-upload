const axios = require("axios").default
const fs = require("fs")
const crypto = require("crypto")
const { v4: uuid } = require("uuid")
const MailAPI = require("./MailAPI")
const CloudAPI = require("./CloudAPI")
const Account = require("./Account")
const config = require("../config.json")
const { events, iterateAsync } = require("./utils")

const VERIFICATION_LINK_REGEX = /https.*secure.*/g
const MEGABYTE = 10 ** 6

class Procedure {
    constructor(account) {
        this.account = account
        this.mailAPI = new MailAPI()
        this.cloudAPI = new CloudAPI()

        this._uploadFile = this._withRetries(this._uploadFile, config.retriesOnError)
        this._createFolder = this._withRetries(this._createFolder, config.retriesOnError)
        this._copyFiles = this._withRetries(this._copyFiles, config.retriesOnError)
    }

    _withRetries(method, amountRetries) {
        return async (...args) => {
            for (let i = 0; i <= amountRetries; i++) {
                try {
                    return await method.apply(this, args)
                } catch (error) {
                    if (i === amountRetries) {
                        throw error
                    }
                    events.status(`Retry no. ${i + 1} ("${error.message}")`)
                }
            }
        }
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
        stream.path = uuid()

        const file = await this.cloudAPI.upload(stream)

        if (!file) {
            throw "Failed to upload file"
        }

        return file
    }

    async _createFolder() {
        const folder = await this.cloudAPI.createFolder(uuid())

        if (!folder) {
            throw "Failed to create folder"
        }

        return folder
    }

    async _copyFiles(files, dest) {
        const success = await this.cloudAPI.copyFiles(files, dest)

        if (!success) {
            throw "Could not copy files"
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
        const file = await this._uploadFile()
        
        let source = file, dest

        for (let i = 0; i < config.folderingIterations; i++) {
            const iteration = `(Iteration ${i + 1})`

            events.status(`Create folder ${iteration}`)
            dest = await this._createFolder()

            events.status(`Copy files ${iteration}`)
            await iterateAsync(
                () => this._copyFiles([source], dest),
                config.copyFileAmount
            )

            source = dest
        }
    }
}

module.exports = Procedure
