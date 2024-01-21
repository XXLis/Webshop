const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const productsPath = 'products.json';
const ordersPath = 'orders.json';

app.get('/api/products', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van producten.' });
    }
});

app.post('/api/products', (req, res) => {
    try {
        const newProduct = req.body;
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Er is een fout opgetreden bij het toevoegen van het product.' });
    }
});

app.post('/api/orders', (req, res) => {
    try {
        const newOrder = req.body;
        let orders = [];

        if (fs.existsSync(ordersPath)) {
            orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        }

        orders.push(newOrder);
        fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Er is een fout opgetreden bij het toevoegen van de bestelling.' });
    }
});

app.listen(port, () => {
    console.log(`Server is gestart op poort ${port}`);
});

app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    try {
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        products = products.filter(product => product.id !== productId);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(200).json({ message: 'Product verwijderd' });
    } catch (error) {
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
        res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van bestellingen.' });
    }
});
