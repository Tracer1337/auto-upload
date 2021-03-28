const puppeteer = require("puppeteer")
const waitForNetworkIdle = require("./lib/waitForNetworkIdle")

const URL = "https://cloud2go.tk/drive"
const EMAIL = "ned07725@eoopy.com"
const PASSWORD = "123456"

const EMAIL_SELECTOR = "#login-email"
const PASSWORD_SELECTOR = "#login-password"
const LOGIN_BUTTON_SELECTOR = "button"
const FILE_BUTTON_SELECTOR = "files-grid-item"
const CONTEXT_BUTTONS_SELECTOR = "drive-context-menu button"
const COPY_BUTTON_INDEX = 6

if (!process.send) {
    process.send = (message) => {
        if (message.event === "status") {
            console.log(message.value)
        }
    }
}

async function login(page) {
    await page.type(EMAIL_SELECTOR, EMAIL)
    await page.type(PASSWORD_SELECTOR, PASSWORD)
    await page.click(LOGIN_BUTTON_SELECTOR)
    await page.waitForNavigation()
}

async function copyLatestFile(page) {
    await page.click(FILE_BUTTON_SELECTOR, { button: "right" })
    const contextButtons = await page.$$(CONTEXT_BUTTONS_SELECTOR)
    const copyButton = contextButtons[COPY_BUTTON_INDEX]
    await Promise.all([
        waitForNetworkIdle(page),
        copyButton.click()
    ])
}

async function withIndicator(fn, message) {
    process.send({ event: "status", value: message })
    await fn()
}

;(async () => {
    process.send({ event: "start" })

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--window-size=1920,1080"
        ],
        defaultViewport: null
    })
    const page = await browser.newPage()
    await page.goto(URL)

    await withIndicator(() => login(page), "Logging in...")
    
    await waitForNetworkIdle(page)
    await page.waitForTimeout(3000)

    let i = 0
    while (true) {
        await withIndicator(() => copyLatestFile(page), i++)
    }
})()
