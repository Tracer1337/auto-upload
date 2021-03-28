const puppeteer = require("puppeteer")
const waitForNetworkIdle = require("./lib/waitForNetworkIdle")

const URL = "https://cloud2go.tk/drive"
const EMAIL = "osr60157@eoopy.com"
const PASSWORD = "123456"

const EMAIL_SELECTOR = "#login-email"
const PASSWORD_SELECTOR = "#login-password"
const LOGIN_BUTTON_SELECTOR = "button"
const FILE_BUTTON_SELECTOR = "files-grid-item"
const CONTEXT_BUTTONS_SELECTOR = "drive-context-menu button"
const COPY_BUTTON_INDEX = 6

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

;(async () => {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage()
    await page.goto(URL)

    await login(page)
    await waitForNetworkIdle(page)
    await page.waitForTimeout(3000)

    let i = 0
    while (true) {
        console.log(`Iteration: ${i}`)
        await copyLatestFile(page)
        console.log("Done")
        i++
    }
})()
