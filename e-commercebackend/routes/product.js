const router = require('express').Router();
const Product = require('../models/product');
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        const productsByCategory = products.reduce((acc, product) => {
            const { category } = product;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        res.json(productsByCategory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;