const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});
router.post('/wishlist', protect, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        res.json({ message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
router.put('/wishlist', protect, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/wishlist', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/wishlist/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;
        user.wishlist.pull(productId);
        await user.save();
        res.json({ message: 'Item removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;