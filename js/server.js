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


app.get('/api/products', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van producten.' });
    }
});

app.post('/api/products', (req, res) => {
    try {
        const newProduct = req.body;
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

        // Assign new ID to the product
        const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        newProduct.id = nextId; // Set the next ID here

        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(201).json(products); // Return the updated products list
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the product.' });
    }
});


app.post('/api/orders', (req, res) => {
    console.log('Received new order:', req.body);
    try {
        const newOrder = req.body;
        let orders = [];

        if (fs.existsSync(ordersPath)) {
            orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        }

        orders.push(newOrder);
        fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
        console.log('Order added successfully:', newOrder);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Er is een fout opgetreden bij het toevoegen van de bestelling.' });
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
