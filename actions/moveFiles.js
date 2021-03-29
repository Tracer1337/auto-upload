const faker = require("faker")
const config = require("../config.json")
const waitForNetworkIdle = require("../lib/waitForNetworkIdle")
const url = require("../url.json")
const { request, post } = require("../utils")

const FOLDER_CREATE_BUTTON_SELECTOR = "sidebar-action-buttons button:nth-child(2)"
const FOLDER_NAME_INPUT_SELECTOR = "mat-dialog-content input"
const FOLDER_SUBMIT_BUTTON_SELECTOR = "mat-dialog-actions button:nth-child(2)"

const FILES_URL = "https://cloud2go.tk/secure/drive/entries?orderBy=updated_at&orderDir=desc&folderId=root"
const MOVE_URL = "https://cloud2go.tk/secure/drive/entries/move"

async function createFolder(page) {
    await page.click(FOLDER_CREATE_BUTTON_SELECTOR)
    await page.type(FOLDER_NAME_INPUT_SELECTOR, faker.internet.userName())
    await page.click(FOLDER_SUBMIT_BUTTON_SELECTOR)
}

function makeMovePayload(folder, files) {
    return {
        destination: folder.id,
        entries: files.map(file => ({
            id: file.id,
            type: "file"
        }))
    }
}

async function moveFilesIntoFolder(page) {
    const { data: files } = await request(page, FILES_URL)
    const folder = files.shift()
    const payload = makeMovePayload(folder, files)
    await post(page, MOVE_URL, payload)
}

async function moveFiles(browser) {
    const page = await browser.newPage()
    await page.goto(url.drive)
    await page.waitForTimeout(config.pageTimeout)

    await Promise.all([
        waitForNetworkIdle(page),
        createFolder(page)
    ])

    await page.waitForTimeout(1000)

    await moveFilesIntoFolder(page)

    await page.close()
}

module.exports = moveFiles
