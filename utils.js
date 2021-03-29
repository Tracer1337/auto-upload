const fs = require("fs")
const path = require("path")
const config = require("./config.json")

const TEMP_PATH = path.join(__dirname, config.tempDir)

if (!process.send) {
    process.send = (message) => {
        if (message.event === "status") {
            console.log(message.value)
        }
    }
}

module.exports.events = {
    start: () => process.send({ event: "start" }),
    status: (value) => process.send({ event: "status", value }),
    stop: () => process.send({ event: "stop" })
}

module.exports.ensureTempDirExists = async () => {
    if (!fs.existsSync(TEMP_PATH)) {
        await fs.promises.mkdir(TEMP_PATH)
    }
}
