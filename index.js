const config = require("./config.json")
const Procedure = require("./src/Procedure")

async function run() {
    const procedure = new Procedure()
    await procedure.run()
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
