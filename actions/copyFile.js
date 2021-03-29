const waitForNetworkIdle = require("../lib/waitForNetworkIdle.js")
const config = require("../config.json")
const url = require("../url.json")

const FILE_SELECTOR = "files-grid-item"
const CONTEXT_BUTTONS_SELECTOR = "drive-context-menu button"
const COPY_BUTTON_INDEX = 6

async function _copyFile(page) {
    await page.click(FILE_SELECTOR, { button: "right" })
    const contextButtons = await page.$$(CONTEXT_BUTTONS_SELECTOR)
    const copyButton = contextButtons[COPY_BUTTON_INDEX]
    await copyButton.click()
}

async function iterate(page) {
    for (let i = 0; i < config.copyFileAmount; i++) {
        await _copyFile(page)
        await page.waitForTimeout(500)
    }
}

async function copyFile(browser) {
    const page = await browser.newPage()
    await page.goto(url.drive)
    await page.waitForTimeout(1000)

    await Promise.all([
        waitForNetworkIdle(page),
        iterate(page)
    ])

    await page.close()
}

module.exports = copyFile
