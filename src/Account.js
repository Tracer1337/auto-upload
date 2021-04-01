const fs = require("fs")
const path = require("path")
const config = require("../config.json")
const { ensureFileExists } = require("./utils")

const ACCOUNTS_FILE = path.join(__dirname, "..", config.accountsFile)

class Account {
    static async findByIndex(index) {
        const accounts = await this.readAccounts()
        return !accounts[index] ? null : this.fromJSON(accounts[index])
    }

    static fromJSON(json) {
        return new Account(json.email, json.password)
    }

    static async readAccounts() {
        await ensureFileExists(ACCOUNTS_FILE)
        return JSON.parse(
            await fs.promises.readFile(ACCOUNTS_FILE, "utf-8") || "[]"
        )
    }

    static async writeAccounts(accounts) {
        await fs.promises.writeFile(
            ACCOUNTS_FILE,
            JSON.stringify(accounts, null, 4),
            "utf-8"
        )
    }

    constructor(email, password) {
        this.email = email
        this.password = password
    }

    async store() {
        const accounts = await Account.readAccounts()
        accounts.push(this)
        await Account.writeAccounts(accounts)
    }

    toJSON() {
        return {
            email: this.email,
            password: this.password
        }
    }
}

module.exports = Account
