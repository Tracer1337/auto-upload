const config = require("./config.json")
const Procedure = require("./src/Procedure")
const { events } = require("./src/utils")

async function run() {
    const procedure = new Procedure()
    events.start()
    try {
        await procedure.run()
    } catch (error) {
        events.status(error.message)
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
