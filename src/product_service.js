const express = require("express");
const app = express();
app.use(express.json());

let productIdCounter = 0; // global product counter for id
const productDB = []; // a simple array acting as the product database

// Create a new product
app.post("/products", (req, res) => {
    const { name, price, stock } = req.body;
    let productId = productIdCounter++;

    if (!name || !price || !stock) {
        return res.status(400).send("Missing product details.");
    }

    try {
        const product = {
            productId,
            name,
            price,
            stock,
        };

        productDB.push(product);
        console.log("Product created"); // testing, remove for final
        res.status(201).json(product);
    } catch (err) {
        console.error("Product not created", err); // testing, remove for final
        res.status(500).send("Internal server error");
    }
});

// Get product details by ID
app.get("/products/:productId", (req, res) => {
    const product = productDB[req.params.productId];

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.json(product);
});

// Update a product
app.put("/products/:productId", (req, res) => {
    const productId = parseInt(req.params.productId);
    const product = productDB[productId];

    if (!product) {
        return res.status(404).send("Product not found");
    }

    const { name, price, stock } = req.body;

    if (typeof name !== "undefined") product.name = name;
    if (typeof price !== "undefined") product.price = price;
    if (typeof stock !== "undefined") product.stock = stock;

    productDB[productId] = product;
    res.json(product);
});

// Delete a product
app.delete("/products/:productId", (req, res) => {
    const productId = parseInt(req.params.productId);
    const product = productDB[productId];

    if (!product) {
        return res.status(404).send("Product not found");
    }

    productDB.splice(productId, 1); // Remove the product
    productIdCounter--; // Adjust the product counter

    // Reassign product IDs if needed (optional, for consistency)
    for (let i = productId; i < productDB.length; i++) {
        productDB[i].productId = i;
    }

    res.send("Product deleted");
});

app.listen(3001, () => console.log("Product service listening on port 3001!"));
