const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');

// Middleware: auth
router.use(auth);

// Upgrade account
router.post('/upgrade', async (req, res) => {
    const { paymentMethodId } = req.body;

    try {
        // Create a customer on Stripe
        const customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            email: req.user.email,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // Subscribe the customer to a plan
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: 'your_plan_id' }],
            expand: ['latest_invoice.payment_intent'],
        });

        // Update user to premium
        // Assuming you have a field `isPremium` in User model
        await User.findByIdAndUpdate(req.user.id, { isPremium: true });

        res.json({ msg: 'Account upgraded' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
