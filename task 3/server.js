const http = require("http");

const customers = [];

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/home") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Welcome to Home"
        }));
    }

    else if (req.method === "GET" && req.url === "/products") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Products",
            data: [
                {
                    id: 1,
                    name: "Laptop",
                    price: 25000
                },
                {
                    id: 2,
                    name: "Phone",
                    price: 15000
                }
            ]
        }));
    }

    else if (req.method === "GET" && req.url === "/orders") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Orders",
            data: [
                {
                    id: 101,
                    product: "Laptop",
                    quantity: 1
                },
                {
                    id: 102,
                    product: "Phone",
                    quantity: 2
                }
            ]
        }));
    }

    else if (req.method === "POST" && req.url === "/customers") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            const customerData = JSON.parse(body);

            customers.push(customerData);

            res.writeHead(201, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Data received and stored successfully",
                data: customerData
            }));
        });
    }

    else {

        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Route not found"
        }));
    }

});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});