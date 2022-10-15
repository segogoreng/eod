const { Account } = require("./account");
const { Worker } = require("node:worker_threads");
const fs = require("fs");
const { stringify } = require("csv-stringify");

const NUM_OF_THREADS = 8;

class EndOfDay {
    constructor() {
        this.data = [];
    }

    addData(account) {
        this.data.push(new Account(account));
    }

    process() {
        let exitCounter = 0;

        for (let i = 0; i < NUM_OF_THREADS; i++) {
            const startIdx = i * 25;
            const endIdx = startIdx + 24;

            const worker = new Worker("./src/account-processor.js", {
                workerData: {
                    accounts: this.data,
                    startIdx,
                    endIdx,
                },
            });

            const self = this;

            worker.on("message", function (message) {
                self.data[message.index] = message.account;
            });

            worker.on("exit", function () {
                exitCounter++;
                if (exitCounter >= NUM_OF_THREADS) {
                    self.addBonusBalanceToFirstHundred();
                }
            });
        }
    }

    addBonusBalanceToFirstHundred() {
        let exitCounter = 0;

        for (let i = 0; i < NUM_OF_THREADS; i++) {
            const startIdx = i * 12;
            const endIdx = i === NUM_OF_THREADS - 1 ? 99 : startIdx + 11;

            const worker = new Worker("./src/bonus-processor.js", {
                workerData: {
                    accounts: this.data,
                    startIdx,
                    endIdx,
                },
            });

            const self = this;

            worker.on("message", function (message) {
                self.data[message.index] = message.account;
            });

            worker.on("exit", function () {
                exitCounter++;
                if (exitCounter >= NUM_OF_THREADS) {
                    self.writeToCsv();
                }
            });
        }
    }

    writeToCsv() {
        const writableStream = fs.createWriteStream("./after-eod.csv");
        const columns = [
            "id",
            "Nama",
            "Age",
            "Balanced",
            "No 2b Thread-No",
            "No 3 Thread-No",
            "Previous Balanced",
            "Average Balanced",
            "No 1 Thread-No",
            "Free Transfer",
            "No 2a Thread-No",
        ];
        const stringifier = stringify({ header: true, columns, delimiter: ";" });

        for (let i = 0; i < 200; i++) {
            stringifier.write([
                this.data[i].id,
                this.data[i].name,
                this.data[i].age,
                this.data[i].balance,
                this.data[i].balanceBonusThreadId,
                this.data[i].firstHundredBalanceBonusThreadId ?? "NOT PROCESSED",
                this.data[i].previousBalance,
                this.data[i].averageBalance,
                this.data[i].averageBalanceThreadId,
                this.data[i].freeTransfer,
                this.data[i].freeTransferThreadId,
            ]);
        }

        stringifier.pipe(writableStream);
    }
}

exports.EndOfDay = EndOfDay;
