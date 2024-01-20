const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
const productsPath = path.join(__dirname, '..', 'json', 'products.json');
const ordersPath = path.join(__dirname, '..', 'json', 'orders.json');

// Function to generate a new unique product ID
function getNextProductId(products) {
    if (products.length === 0) {
        return 1;
    }
    const maxId = Math.max(...products.map(product => product.id));
    return maxId + 1;
}

app.get('/api/products', (req, res) => {
    // ...
});

app.post('/api/products', (req, res) => {
    try {
        const newProduct = req.body;
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        
        // Assign a new unique ID
        newProduct.id = getNextProductId(products);

        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Er is een fout opgetreden bij het toevoegen van het product.' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    // ...
});

// ... (rest of the server.js file remains unchanged)
