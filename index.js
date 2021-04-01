const config = require("./config.json")
const { events } = require("./utils")

async function run() {
    events.start()

    for (let i = 0; i < config.folderingIterations; i++) {
        const iterationStatus = `(Iteration ${i})`
    }

    await browser.close()
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
