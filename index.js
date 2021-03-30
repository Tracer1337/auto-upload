const config = require("./config.json")
const { events } = require("./utils")
const generateFile = require("./actions/generateFile.js")
const startBrowser = require("./actions/startBrowser.js")
const register = require("./actions/register.js")
const storeAccount = require("./actions/storeAccount")
const login = require("./actions/login.js")
const uploadFile = require("./actions/uploadFile.js")
const copyFile = require("./actions/copyFile.js")
const moveFiles = require("./actions/moveFiles.js")

async function run() {
    events.start()

    events.status("Generate file")
    const filepath = await generateFile()

    events.status("Start browser")
    const browser = await startBrowser()

    events.status("Register")
    const [email, password] = await register(browser)
    await storeAccount(email, password)

    events.status("Login")
    await login(browser, { email, password })

    events.status("Upload file")
    await uploadFile(browser, filepath)

    for (let i = 0; i < config.folderingIterations; i++) {
        const iterationStatus = `(Iteration ${i})`
        
        events.status("Copy files " + iterationStatus)
        await copyFile(browser)
    
        events.status("Move files " + iterationStatus)
        await moveFiles(browser)
    }

    await browser.close()
    events.stop()
}

async function loop() {
    while (true) {
        await run()
    }
}

if (config.autoRestart) {
    loop()
} else {
    run()
}
