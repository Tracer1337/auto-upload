const path = require("path")
const fs = require("fs")
const puppeteer = require("puppeteer")
const waitForNetworkIdle = require("./lib/waitForNetworkIdle")

const FILENAME = process.argv[2]

if (!FILENAME) {
    throw new Error("Missing argument: filename")
}

const URL = "https://cloud2go.tk/drive"
const EMAIL = "osr60157@eoopy.com"
const PASSWORD = "123456"
const FILE_PATH = path.join(__dirname, FILENAME)

const EMAIL_SELECTOR = "#login-email"
const PASSWORD_SELECTOR = "#login-password"
const LOGIN_BUTTON_SELECTOR = "button"
const UPLOAD_BUTTON_SELECTOR = "sidebar-action-buttons button"

if (!fs.existsSync(FILE_PATH)) {
    throw new Error("File does not exist")
}

async function login(page) {
    await page.type(EMAIL_SELECTOR, EMAIL)
    await page.type(PASSWORD_SELECTOR, PASSWORD)
    await page.click(LOGIN_BUTTON_SELECTOR)
    await page.waitForNavigation()
}

async function upload(page, file) {
    const button = await page.$(UPLOAD_BUTTON_SELECTOR)
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        button.evaluate(e => e.click())
    ])
    await Promise.all([
        waitForNetworkIdle(page),
        fileChooser.accept([file])
    ])
}

;(async () => {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage()
    await page.goto(URL)

    await login(page)

    let i = 0
    while (true) {
        console.log(`Iteration: ${i}`)
        await upload(page, FILE_PATH)
        console.log("Done")
        i++
    }
})()
