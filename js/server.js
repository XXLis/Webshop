const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

// Initializing the express application
const app = express();
const port = 3000;

// Applying middleware for parsing JSON and enabling CORS
app.use(bodyParser.json());
app.use(cors());

// Paths to the products and orders JSON files
const productsPath = path.join(__dirname, '..', 'json', 'products.json');
const ordersPath = path.join(__dirname, '..', 'json', 'orders.json');

// Function to generate the next product ID based on the highest ID present in the list
function getNextProductId(products) {
    if (products.length === 0) {
        return 1;
    }
    return Math.max(...products.map(p => p.id)) + 1;
}

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
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        const nextId = getNextProductId(products);

        // Creating new product object with 'id' as the first property
        const newProduct = {
            id: nextId,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image
        };

        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the product.' });
    }
});

// DELETE endpoint to remove a product by its ID
app.delete('/api/products/:id', (req, res) => {
    try {
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        products = products.filter(product => product.id !== parseInt(req.params.id));

        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(200).json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the product.' });
    }
});

// POST endpoint to add a new order
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
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the order.' });
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

// Starting the server on the specified port
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.use('/data', express.static(path.join(__dirname, 'data')));


