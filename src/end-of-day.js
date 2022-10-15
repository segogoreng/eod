const { Account } = require("./account");

class EndOfDay {
    constructor() {
        this.data = [];
    }

    addData(account) {
        this.data.push(new Account(account));
    }

    process() {
        console.log(this.data);
    }
}

exports.EndOfDay = EndOfDay;
