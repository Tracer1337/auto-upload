const fs = require("fs")
const path = require("path")
const { v4: uuid } = require("uuid")
const crypto = require("crypto")
const config = require("../config.json")
const { ensureDirExists } = require("../utils")

const MEGABYTE = 10 ** 6
const TEMP_PATH = path.join(__dirname, "..", config.tempDir)

async function generateFile() {
    await ensureDirExists(TEMP_PATH)

    const filename = uuid()
    const filepath = path.join(TEMP_PATH, filename)

    const buffer = crypto.randomBytes(MEGABYTE * config.uploadFileSizeMB)
    await fs.promises.writeFile(filepath, buffer)
    
    return filepath
}

module.exports = generateFile
