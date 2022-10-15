const fs = require("fs");
const { EndOfDay } = require("./src/end-of-day");
const { parse } = require("csv-parse");

const endOfDay = new EndOfDay();

fs.createReadStream("./before-eod.csv")
    .pipe(parse({ delimiter: ";", from_line: 2 }))
    .on("data", function (row) {
        endOfDay.addData(row);
    })
    .on("end", function () {
        endOfDay.process();
    });
