const express = require("express");
const app = express();
app.use(express.json());

let customerIdCounter = 0; // global customer counter for id
const customerDB = []; // simple array acting as the customer database

// Create a new customer
app.post("/customers", (req, res) => {
    const { name, email, address } = req.body;
    let customerId = customerIdCounter++;

    if (!name || !email || !address) {
        return res.status(400).send("Missing customer details.");
    }

    try {
        const customer = {
            customerId,
            name,
            email,
            address,
        };

        customerDB.push(customer);
        console.log("Customer created"); // testing, remove for final
        res.status(201).json(customer);
    } catch (err) {
        console.error("Customer not created", err); // testing, remove for final
        res.status(500).send("Internal server error");
    }
});

// Get customer details by ID
app.get("/customers/:customerId", (req, res) => {
    const customer = customerDB[req.params.customerId];

    if (!customer) {
        return res.status(404).send("Customer not found");
    }

    res.json(customer);
});

// Update customer information
app.put("/customers/:customerId", (req, res) => {
    const customerId = parseInt(req.params.customerId);
    const customer = customerDB[customerId];

    if (!customer) {
        return res.status(404).send("Customer not found");
    }

    const { name, email, address } = req.body;

    if (typeof name !== "undefined") customer.name = name;
    if (typeof email !== "undefined") customer.email = email;
    if (typeof address !== "undefined") customer.address = address;

    customerDB[customerId] = customer;
    res.json(customer);
});

// Delete a customer
app.delete("/customers/:customerId", (req, res) => {
    const customerId = parseInt(req.params.customerId);
    const customer = customerDB[customerId];

    if (!customer) {
        return res.status(404).send("Customer not found");
    }

    customerDB.splice(customerId, 1); // Remove the customer
    customerIdCounter--; // Adjust the customer counter

    // Reassign customer IDs if needed (optional, for consistency)
    for (let i = customerId; i < customerDB.length; i++) {
        customerDB[i].customerId = i;
    }

    res.send("Customer deleted");
});

app.listen(3002, () => console.log("Customer service listening on port 3002!"));
