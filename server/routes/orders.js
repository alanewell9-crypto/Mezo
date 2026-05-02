const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

let orders = [];

router.get('/orders/:customerId', (req, res) => {
    const { customerId } = req.params;
    const customerOrders = orders.filter(order => order.customerId === customerId);
    res.json(customerOrders);
});

router.post('/orders', async (req, res) => {
    try {
        const { customerId, items, totalAmount, stripeToken } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: 'eur',
            source: stripeToken,
        });

        if (paymentIntent.status === 'succeeded') {
            const newOrder = {
                id: Date.now().toString(),
                customerId,
                items,
                totalAmount,
                commission: totalAmount * 0.20,
                vendorPayout: totalAmount * 0.80,
                status: 'completed',
                paymentId: paymentIntent.id,
                createdAt: new Date(),
            };
            orders.push(newOrder);
            res.status(201).json(newOrder);
        } else {
            res.status(400).json({ message: 'Payment failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/orders/details/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = orders.find(order => order.id === orderId);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
});

router.put('/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = orders.find(order => order.id === orderId);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    res.json(order);
});

router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === 'payment_intent.succeeded') {
            console.log('Payment confirmed:', event.data.object.id);
        }
        res.json({received: true});
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

module.exports = router;
