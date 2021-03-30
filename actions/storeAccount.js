const fs = require("fs")
const path = require("path")
const config = require("../config.json")
const { ensureFileExists } = require("../utils.js")

const ACCOUNTS_FILE = path.join(__dirname, "..", config.accountsFile)

class Account {
    constructor(email, password) {
        this.email = email
        this.password = password
    }
}

async function storeAccount(email, password) {
    await ensureFileExists(ACCOUNTS_FILE)

    const content = await fs.promises.readFile(ACCOUNTS_FILE, "utf-8")

    const accounts = JSON.parse(content || "[]")
    accounts.push(new Account(email, password))

    const newContent = JSON.stringify(accounts, null, 4)

    await fs.promises.writeFile(ACCOUNTS_FILE, newContent, "utf-8")
}

module.exports = storeAccount
