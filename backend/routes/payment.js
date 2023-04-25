const { Router } = require('express');
const stripe = require("stripe")('sk_test_51MG5mMSAjIDYdsb42ais3kMYuPNI1Rm8mtXndywsF77nujsxeKbOO0geDGj880pk91FLXURfg1xRcSXrjcTtOFdp008mcdMrbL');
const endpointSecret = "whsec_6063e2cac8c100eb24b859a5bb418d17dbd6cbae287539a89c020f9591d70a38";
const express = require('express');
const Order = require("../OrderModel");

const router = Router();
router.post("/create-checkout-session", async (req, res) => {
    const email = req.body.email;
    console.log(email);
    const orderData = [
        {
            size: 4,
            color: "green"
        },
        {
            size: 5,
            color: "red"
        },
        {
            size: 7,
            color: "blue"
        }
    ];

    const customer = await stripe.customers.create({
        email,
        metadata: {
            cart: JSON.stringify(orderData)
        }
    })

    console.log(customer);
    const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ['IN', 'PK', 'BD'] },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 0, currency: 'inr' },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 5 },
                        maximum: { unit: 'business_day', value: 7 },
                    },
                },
            },
        ],
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount_decimal: 180.97 * 100,
                },
                quantity: 1,
            },
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Jeans',
                    },
                    unit_amount_decimal: 200.97 * 100,
                },
                quantity: 3,
            },
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Sweaters',
                    },
                    unit_amount_decimal: 500.97 * 100,
                },
                quantity: 2,
            },
        ],
        customer: customer.id,
        mode: 'payment',
        success_url: 'http://127.0.0.1:5173/user?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:4242/theme',
    });

    res.json({ url: session.url });
});

router.get('/verify-payment/:id', async (req, res) => {
    const id= req.params.id;
    console.log(id);
    try {
        const session = await stripe.checkout.sessions.retrieve(id);
        return res.status(200).json({
            msg: "Your payment has been verified sucessfully",
            status: session.payment_status
        })
    } catch (error) {
        return res.status(500).json({ msg: "Server internal error" })
    }
})

router.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        case 'checkout.session.completed':
            const data = event.data.object;
            let customer = await stripe.customers.retrieve(data.customer);
            customer = JSON.parse(customer?.metadata?.cart);
            console.log(customer);

            customer.forEach(async ctr => {
                try {
                    const orderResponse = await Order({
                        productId: "77g3728832",
                        userId: "8uebwibfuwef",
                        size: ctr.size,
                        color: ctr.color,
                        quantity: 3,
                        address: data.customer_details.address
                    })

                    const order = await orderResponse.save();
                } catch (error) {
                    console.log(error.message);
                    return res.status(500).json({ msg: "Server internal error" })
                }
            })
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

module.exports = router;

