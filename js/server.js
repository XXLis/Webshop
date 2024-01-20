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
    try {
        const productId = parseInt(req.params.id);
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        products = products.filter(product => product.id !== productId);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(200).json({ message: 'Product verwijderd' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Er is een fout opgetreden bij het verwijderen van het product.' });
    }
});

app.get('/api/orders', (req, res) => {
    try {
        if (!fs.existsSync(ordersPath)) {
            res.status(200).json([]);
        } else {
            const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
            res.status(200).json(orders);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van bestellingen.' });
    }
});

app.listen(port, () => {
    console.log(`Server is gestart op poort ${port}`);
});
