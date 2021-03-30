const fs = require("fs")

if (!process.send) {
    process.send = (message) => {
        if (message.event === "status") {
            console.log(message.value)
        }
    }
}

const events = {
    start: () => process.send({ event: "start" }),
    status: (value) => process.send({ event: "status", value }),
    stop: () => process.send({ event: "stop" })
}

async function ensureDirExists(dirpath) {
    if (!fs.existsSync(dirpath)) {
        await fs.promises.mkdir(dirpath)
    }
}

async function ensureFileExists(filepath) {
    if (!fs.existsSync(filepath)) {
        await fs.promises.writeFile(filepath, "")
    }
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

module.exports = {
    events,
    ensureDirExists,
    ensureFileExists,
    getXSRFToken,
    request,
    post
}
