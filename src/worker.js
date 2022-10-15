const { workerData, threadId, parentPort } = require("node:worker_threads");

class AccountProcessor {
    constructor(data, passedThreadId) {
        this.accounts = data.accounts;
        this.startIdx = data.startIdx;
        this.endIdx = data.endIdx;
        this.threadId = passedThreadId;
    }

    process() {
        for (let i = this.startIdx; i <= this.endIdx; i++) {
            this.calculateAvgBalance(this.accounts[i]);
            this.updateBenefit(this.accounts[i]);
            this.accounts[i].averageBalanceThreadId = threadId;
            this.accounts[i].freeTransferThreadId = threadId;
            this.accounts[i].bonusBalanceThreadId = threadId;

            parentPort.postMessage({
                index: i,
                account: this.accounts[i],
            });
        }
    }

    calculateAvgBalance(account) {
        account.averageBalance = (account.balance + account.previousBalance) / 2;
    }

    updateBenefit(account) {
        if (account.balance >= 100 && account.balance <= 150) {
            account.freeTransfer = 5;
        } else if (account.balance > 150) {
            account.balance += 25;
        }
    }
}

const accountProcessor = new AccountProcessor(workerData, threadId);
accountProcessor.process();
