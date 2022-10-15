class Account {
    constructor(rawAccountData) {
        this.id = rawAccountData[0];
        this.name = rawAccountData[1];
        this.age = rawAccountData[2];
        this.balance = parseInt(rawAccountData[3]);
        this.previousBalance = parseInt(rawAccountData[4]);
        this.averageBalance = parseInt(rawAccountData[5]);
        this.freeTransfer = parseInt(rawAccountData[6]);
    }
}

exports.Account = Account;
