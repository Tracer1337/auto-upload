const { events } = require("./utils")
const generateFile = require("./actions/generateFile.js")
const startBrowser = require("./actions/startBrowser.js")
const register = require("./actions/register.js")
const storeAccount = require("./actions/storeAccount")
const login = require("./actions/login.js")

async function run() {
    events.start()

    events.status("Generate file")
    const filepath = await generateFile()

    events.status("Start browser")
    const browser = await startBrowser()

    events.status("Register account")
    const [email, password] = await register(browser)

    events.status("Store account")
    await storeAccount(email, password)

    events.status("Log into account")
    const page = await login(browser, { email, password })

    // Upload file

    // Copy file 10 times

    // Move files into folder
}

run()
