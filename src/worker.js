const { workerData, threadId } = require("node:worker_threads");

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
        }

        // console.log(`From thread ${this.threadId}: ${this.startIdx} - ${this.endIdx}`);
        // const account = this.accounts[this.startIdx];
        // console.log(
        //     `Account id ${this.startIdx}: ${account.balance} ${account.previousBalance} ${account.averageBalance} ${account.freeTransfer}`
        // );
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
