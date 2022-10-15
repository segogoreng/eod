class Account {
    constructor(rawAccountData) {
        this.id = rawAccountData[0];
        this.name = rawAccountData[1];
        this.age = rawAccountData[2];
        this.balance = rawAccountData[3];
        this.previousBalance = rawAccountData[4];
        this.averageBalance = rawAccountData[5];
        this.freeTransfer = rawAccountData[6];
    }
}

exports.Account = Account;
