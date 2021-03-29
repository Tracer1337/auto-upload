const waitForNetworkIdle = require("../lib/waitForNetworkIdle.js")
const config = require("../config.json")
const url = require("../url.json")

const FILE_SELECTOR = "files-grid-item"
const CONTEXT_BUTTONS_SELECTOR = "drive-context-menu button:nth-child(7)"

async function _copyFile(page) {
    await page.click(FILE_SELECTOR, { button: "right" })
    await page.click(CONTEXT_BUTTONS_SELECTOR)
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
    await page.waitForTimeout(config.pageTimeout)

    await Promise.all([
        waitForNetworkIdle(page),
        iterate(page)
    ])

    await page.close()
}

module.exports = copyFile
