const { Account } = require("./account");
const { Worker } = require("node:worker_threads");

const NUM_OF_THREADS = 8;

class EndOfDay {
    constructor() {
        this.data = [];
    }

    addData(account) {
        this.data.push(new Account(account));
    }

    process() {
        for (let i = 0; i < NUM_OF_THREADS; i++) {
            const startIdx = i * 25;
            const endIdx = startIdx + 24;

            new Worker("./src/worker.js", {
                workerData: {
                    accounts: this.data,
                    startIdx,
                    endIdx,
                },
            });
        }
    }
}

exports.EndOfDay = EndOfDay;
