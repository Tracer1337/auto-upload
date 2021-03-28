const { spawn } = require("child_process")
const os = require("os")
const { program } = require("commander")

const cpus = os.cpus().length

program
    .option("-n, --n-workers <n>", "Number of workers", parseInt, cpus)
    .option("-s, --script <filename>", "Filename of the script to run", "./copy.js")

program.parse()

const options = program.opts()

function pipe(stream, targetFn) {
    stream.setEncoding("utf-8")
    stream.on("data", data => targetFn(data))
}

for (let i = 0; i < options.nWorkers; i++) {
    const child = spawn("node", [options.script])
    pipe(child.stdout, console.log.bind(console, i))
    pipe(child.stderr, console.error.bind(console, i))
}
