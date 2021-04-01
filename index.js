const { program } = require("commander")
const config = require("./config.json")
const Account = require("./src/Account")
const Procedure = require("./src/Procedure")
const { events } = require("./src/utils")

program
    .option("-a, --account <index>", "Index of the account from accounts.json to use", parseInt)

program.parse()

const options = program.opts()

function handleError(error) {
    if (typeof error === "string") {
        events.status(error)
    } else if (error.isAxiosError) {
        events.status(`API Error: ${error.message}`)
    } else {
        throw error
    }
}

async function run() {
    let account = await Account.findByIndex(options.account)
    const procedure = new Procedure(account)
    events.start()

    try {
        await procedure.run()
    } catch (error) {
        handleError(error)
    }
    
    events.stop()
}

async function loop() {
    while (true) {
        await run()
    }
}

if (config.autoRestart) {
    loop()
} else {
    run()
}
