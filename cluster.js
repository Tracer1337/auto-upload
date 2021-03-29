const cluster = require("cluster")
const os = require("os")
const path = require("path")
const { program } = require("commander")
const React = require("react")
const { render, Text, Box } = require("ink")
const osUtils = require("os-utils")

const cpus = os.cpus().length

program
    .option("-n, --n-workers <n>", "Number of workers", parseInt, cpus)

program.parse()

const options = program.opts()

function bitsToBytes(bits) {
    return bits / Math.pow(1024, 3)
}

function SystemInformation() {
    const [cpu, setCPU] = React.useState(0)
    const [ram, setRAM] = React.useState(0)
    const [totalRam, setTotalRam] = React.useState(0)

    const update = () => {
        osUtils.cpuUsage(setCPU)
        const totalmem = bitsToBytes(os.totalmem())
        const freemem = bitsToBytes(os.freemem())
        setRAM((totalmem - freemem))
        setTotalRam(totalmem)
    }

    React.useEffect(() => {
        setInterval(update, 500)
    }, [])

    return [
        React.createElement(Text, {
            children: `CPU: ${cpu.toFixed(2)}%  `,
            key: 0
        }),
        React.createElement(Text, {
            children: `RAM: ${ram.toFixed(2)}/${totalRam.toFixed(2)}`,
            key: 2
        })
    ]
}

function Worker({ worker }) {
    const [activity, setActivity] = React.useState("Inactive")
    const [status, setStatus] = React.useState("")

    const eventHandlers = {
        "start": () => setActivity("Running"),
        "status": (message) => setStatus(message.value),
        "stop": () => setActivity("Stopped")
    }

    const handleMessage = (message) => {
        if (!(message.event in eventHandlers)) {
            console.warn(`Unsupported event: ${message.event}`)
            return
        }

        eventHandlers[message.event](message)
    }
    
    React.useEffect(() => {
        worker.on("message", handleMessage)
    }, [worker])

    if (activity !== "Running") {
        return React.createElement(Text, {
            children: `${worker.id}: ${activity}`
        })
    }

    return React.createElement(Text, {
        children: `[${worker.id}] ${activity}: ${status}`
    })
}

if (cluster.isMaster) {
    const workers = []
    
    for (let i = 0; i < options.nWorkers; i++) {
        workers[i] = React.createElement(Worker, {
            worker: cluster.fork(),
            key: i
        })
    }

    cluster.on("exit", (worker, code, signal) => {
        if (signal) {
            console.log(`Worker ${worker.id} killed by signal ${signal}`)
        } else if (code !== 0) {
            console.log(`Worker ${worker.id} exited with code ${signal}`)
        } else {
            console.log(`Worker ${worker.id} terminated`)
        }
    })

    render([
        React.createElement(Box, {
            key: 0,
            borderStyle: "classic",
            paddingLeft: 1,
            children: React.createElement(SystemInformation),
        }),
        React.createElement(Box, {
            key: 1,
            borderStyle: "classic",
            paddingLeft: 1,
            flexDirection: "column",
            children: workers
        })
    ])
}

if (cluster.isWorker) {
    require(path.join(__dirname, "index.js"))
}
