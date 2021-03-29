const fs = require("fs")
const path = require("path")
const { v4: uuid } = require("uuid")
const config = require("../config.json")
const { ensureTempDirExists } = require("../utils")

const TEMP_PATH = path.join(__dirname, "..", config.tempDir)

function random(length) {
    return Math.floor(Math.random() * length)
}

function writeAsync(writeStream, content) {
    return new Promise(resolve => {
        writeStream.write(content, resolve)
    })
}

function generateChunk(length, size) {
    const chunk = []
    for (let i = 0; i < length; i++) {
        chunk[i] = random(size)
    }
    return chunk
}

async function generateFile() {
    await ensureTempDirExists()
    
    const filename = uuid()
    const filepath = path.join(TEMP_PATH, filename)
    const writeStream = fs.createWriteStream(filepath)

    for (let i = 0; i < config.uploadFileSizeMB; i++) {
        const chunk = generateChunk(10 ** 6, 10 ** 8)
        const buffer = Buffer.from(chunk)
        await writeAsync(writeStream, buffer)
    }

    writeStream.close()

    return filepath
}

module.exports = generateFile
