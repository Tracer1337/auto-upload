const crypto = require("crypto")

const MEGABYTE = 10 ** 6

class VirtualFile {
    constructor(sizeInMB) {
        this.size = sizeInMB
        this.buffer = Buffer()
    }

    randomize() {
        this.buffer = crypto.randomBytes(this.size * MEGABYTE)
    }

    getBuffer() {
        return this.buffer
    }
}

module.exports = VirtualFile
