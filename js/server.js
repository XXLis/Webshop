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

function getNextProductId(products) {
    if (products.length === 0) {
        return 1;
    }
    return Math.max(...products.map(p => p.id)) + 1;
}

app.get('/api/products', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    res.status(200).json(products);
});

app.post('/api/products', (req, res) => {
    try {
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

        // Obliczenie następnego ID
        const nextId = getNextProductId(products);

        // Tworzenie nowego produktu z 'id' jako pierwszym polem
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


// POST endpoint to add a new product
app.post('/api/products', (req, res) => {
    try {
        const newProduct = req.body;
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

        // Assign a new unique ID to the new product
        newProduct.id = getNextProductId(products);
        
        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the product.' });
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

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
