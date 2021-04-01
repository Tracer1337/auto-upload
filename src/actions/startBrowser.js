const puppeteer = require("puppeteer")
const config = require("../config.json")

async function startBrowser() {
    return await puppeteer.launch({
        headless: config.headless,
        args: [
            "--window-size=1920,1080"
        ],
        defaultViewport: null
    })
}

module.exports = startBrowser
