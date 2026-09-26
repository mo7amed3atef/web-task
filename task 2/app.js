const fs = require("fs");
const myEmitter = require("./event");

let members;
let payments;

fs.readFile("members.txt", "utf8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    members = data;

    if (payments !== undefined) {
        myEmitter.emit("gym-data", members, payments);
    }
});

fs.readFile("payments.txt", "utf8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    payments = data;

    if (members !== undefined) {
        myEmitter.emit("gym-data", members, payments);
    }
});