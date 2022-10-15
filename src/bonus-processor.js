const { workerData, threadId, parentPort } = require("node:worker_threads");

class BonusProcessor {
    constructor(data, passedThreadId) {
        this.accounts = data.accounts;
        this.startIdx = data.startIdx;
        this.endIdx = data.endIdx;
        this.threadId = passedThreadId;
    }

    process() {
        for (let i = this.startIdx; i <= this.endIdx; i++) {
            this.accounts[i].balance += 10;

            this.accounts[i].firstHundredBalanceBonusThreadId = this.threadId;

            parentPort.postMessage({
                index: i,
                account: this.accounts[i],
            });
        }
    }
}

const accountProcessor = new BonusProcessor(workerData, threadId);
accountProcessor.process();
