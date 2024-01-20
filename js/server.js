const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies and enable CORS
app.use(bodyParser.json());
app.use(cors());

// Paths to the products and orders JSON files
const productsPath = path.join(__dirname, '..', 'json', 'products.json');
const ordersPath = path.join(__dirname, '..', 'json', 'orders.json');

// GET endpoint to fetch all products
app.get('/api/products', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
});

// POST endpoint to add a new product
app.post('/api/products', (req, res) => {
    try {
        const newProduct = req.body;
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

        // Generate a new ID for the product
        const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        newProduct.id = nextId;

        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(201).json(products); // Return the updated list of products
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the product.' });
    }
});

// POST endpoint to add a new order
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
        res.status(500).json({ error: 'An error occurred while adding the order.' });
    }
});

// DELETE endpoint to remove a product by ID
app.delete('/api/products/:id', (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        products = products.filter(product => product.id !== productId);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(200).json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the product.' });
    }
});

// GET endpoint to fetch all orders
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
        res.status(500).json({ error: 'An error occurred while fetching orders.' });
    }
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
