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

module.exports = {
    events,
    ensureDirExists,
    ensureFileExists
}
