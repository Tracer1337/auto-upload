const fs = require("fs")
const path = require("path")
const config = require("../config.json")
const { ensureFileExists } = require("./utils")

const ACCOUNTS_FILE = path.join(__dirname, "..", config.accountsFile)

class Account {
    constructor(email, password) {
        this.email = email
        this.password = password
    }

    async readAccounts() {
        await ensureFileExists(ACCOUNTS_FILE)
        return JSON.parse(
            await fs.promises.readFile(ACCOUNTS_FILE, "utf-8") || "[]"
        )
    }

    async writeAccounts(accounts) {
        await fs.promises.writeFile(
            ACCOUNTS_FILE,
            JSON.stringify(accounts, null, 4),
            "utf-8"
        )
    }

    async store() {
        const accounts = await this.readAccounts()
        accounts.push(this)
        await this.writeAccounts(accounts)
    }
}

module.exports = Account
