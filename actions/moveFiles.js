const faker = require("faker")
const config = require("../config.json")
const waitForNetworkIdle = require("../lib/waitForNetworkIdle")
const url = require("../url.json")

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

async function moveFilesIntoFolder(page) {
    await page.keyboard.down(CONTROL_KEY)
    
    const folderPos = await getNthFilePosition(page, 0)
    const firstFilePos = await getNthFilePosition(page, 1)
    await clickFiles(page)
    await drag(page, firstFilePos, folderPos)

    await page.keyboard.up(CONTROL_KEY)
}

async function getXSRFToken(page) {
    const token = await page.evaluate(() => {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }
        return getCookie("XSRF-TOKEN")
    })
    return decodeURIComponent(token)
}

async function request(page, url, options = {}) {
    const xsrfToken = await getXSRFToken(page)

    options.headers = {
        ...options.headers,
        "X-XSRF-Token": xsrfToken
    }
    
    return await page.evaluate(async (url, options) => {
        const res = await fetch(url, options)
        return await res.json()
    }, url, options)
}

function post(page, url, payload) {
    return request(page, url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
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

    moveFilesIntoFolder(page)

    console.log("Done")
}

module.exports = moveFiles
