const { events } = require("./utils")
const generateFile = require("./actions/generateFile.js")
const startBrowser = require("./actions/startBrowser.js")
const register = require("./actions/register.js")
const storeAccount = require("./actions/storeAccount")

async function run() {
    events.start()

    // Generate random 100MB file
    events.status("Generate file")
    const filepath = await generateFile()

    // Start browser
    events.status("Start browser")
    const browser = await startBrowser()

    // Register new account
    events.status("Register account")
    const [email, password] = await register(browser)

    // Store account
    events.status("Store account")
    await storeAccount(email, password)

    // Upload file

    // Copy file 10 times

    // Move files into folder
}

run()
