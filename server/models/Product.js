const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    categories: {
        type: String,
        enum: [
            'Tech & Gaming',
            'Fashion & Lifestyle',
            'Beauté & Santé',
            'Fitness & Sports',
            'Maison & Décoration',
            'Accessoires Phone & Tech'
        ],
        required: true
    },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5 },
    reviews: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] },
    trending: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);