const EventEmitter = require("events");
const fs = require("fs");

const myEmitter = new EventEmitter();

myEmitter.on("gym-data", (members, payments) => {
    const data = `Gym Members:\n${members}\n\nPayments:\n${payments}`;

    fs.writeFile("gym-report.txt", data, (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log("Gym report created successfully!");
    });
});

module.exports = myEmitter;