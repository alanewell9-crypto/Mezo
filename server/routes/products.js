const express = require('express');
const router = express.Router();

// Sample data store (replace with your actual data handling logic)
let products = [];

// Get all products
router.get('/products', (req, res) => {
    res.json(products);
});

// Get trending products
router.get('/products/trending', (req, res) => {
    const trendingProducts = products.filter(product => product.isTrending);
    res.json(trendingProducts);
});

// Filter by category
router.get('/products/category/:category', (req, res) => {
    const { category } = req.params;
    const filteredProducts = products.filter(product => product.category === category);
    res.json(filteredProducts);
});

// Create a new product
router.post('/products', (req, res) => {
    const newProduct = req.body; // Expecting product data in the body
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Update a product
router.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(product => product.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
});

// Delete a product
router.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter(product => product.id !== id);
    res.status(204).send();
});

module.exports = router;