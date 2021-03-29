const { events } = require("./utils")
const generateFile = require("./actions/generateFile.js")

async function run() {
    events.start()

    // Generate random 100MB file
    events.status("Generate file")
    const filepath = await generateFile()

    // Register new account

    // Upload file

    // Copy file 10 times

    // Move files into folder
}

run()
