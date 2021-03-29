const { events } = require("./utils")
const generateFile = require("./actions/generateFile.js")
const startBrowser = require("./actions/startBrowser.js")
const register = require("./actions/register.js")

async function run() {
    events.start()

    // Generate random 100MB file
    events.status("Generate file")
    const filepath = await generateFile()

    // Start browser
    const browser = await startBrowser()

    // Register new account
    const [email, password] = await register(browser)
    console.log({ email, password })

    // Upload file

    // Copy file 10 times

    // Move files into folder
}

run()
