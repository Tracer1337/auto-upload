function waitForNetworkIdle(page) {
    return new Promise(resolve => {
        let active = 0

        page.on("request", onRequestStarted)
        page.on("requestfinished", onRequestFinished)
        page.on("requestfailed", onRequestFinished)

        const removeListeners = () => {
            page.removeListener("request", onRequestStarted)
            page.removeListener("requestfinished", onRequestFinished)
            page.removeListener("requestfailed", onRequestFinished)
        }

        function onRequestStarted() {
            active++
        }

        function onRequestFinished() {
            if (--active === 0) {
                removeListeners()
                resolve()
            }
        }
    })
}

module.exports = waitForNetworkIdle
