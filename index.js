const { events } = require("./utils")
const generateFile = require("./actions/generateFile.js")
const startBrowser = require("./actions/startBrowser.js")
const register = require("./actions/register.js")
const storeAccount = require("./actions/storeAccount")
const login = require("./actions/login.js")
const uploadFile = require("./actions/uploadFile.js")
const copyFile = require("./actions/copyFile.js")

async function run() {
    events.start()

    events.status("Generate file")
    const filepath = await generateFile()

    events.status("Start browser")
    const browser = await startBrowser()

    events.status("Register account")
    const [email, password] = await register(browser)
    await storeAccount(email, password)

    events.status("Log into account")
    await login(browser, { email, password })

    events.status("Upload file")
    await uploadFile(browser, filepath)

    // Copy file 10 times
    events.status("Copy file")
    await copyFile(browser)

    // Move files into folder
}

run()
