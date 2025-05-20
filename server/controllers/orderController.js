import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from 'stripe'
import User from "../models/User.js"

//PLACE ORDER COD : /api/order/cod
export const placeOrderCOD = async (req , res) => {
    try {
        const userId = req.userId ;
        const {items , address} = req.body ;
        if(!address || items.length === 0) {
            return res.json({
                success : false ,
                message : "Invalid data"
            })
        }

        // Calculte amount using items
        // acc ---> initial count of the amount 
        let amount = await items.reduce(async (acc , item) => {
            const product = await Product.findById(item.product) ;
            return (await acc) + product.offerPrice * item.quantity ;
        } , 0) // initial acc value is 0


        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02) ;

        await Order.create({
            userId, 
            items,
            amount,
            address,
            paymentType : "COD"
        });

        return res.json({
            success : true ,
            message : "Order Placed Successfully"
        })

    } catch (error) {
        console.log(error.message) ;

        return res.json({
            success : false ,
            message : error.message
        })
    }
}


// PLACE ORDER STRIPE : /api/order/stripe
export const placeOrderStripe = async (req , res) => {
    try {
        const userId = req.userId ;
        const {items , address} = req.body ;

        // from where the request was created ie. frontend URL
        const {origin} = req.headers ;

        if(!address || items.length === 0) {
            return res.json({
                success : false ,
                message : "Invalid data"
            })
        }

        let productData = [] ;

        // Calculte amount using items
        // acc ---> initial count of the amount 
        let amount = await items.reduce(async (acc , item) => {
            const product = await Product.findById(item.product) ;
            productData.push({
                name : product.name ,
                price : product.offerPrice,
                quantity : item.quantity
            });
            return (await acc) + product.offerPrice * item.quantity ;
        } , 0) // initial acc value is 0


        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02) ;

        const order = await Order.create({
            userId, 
            items,
            amount,
            address,
            paymentType : "Online"
        });

        // Stripe Gateway Initialize 
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data : {
                    currency : "usd" ,
                    product_data : {
                        name : item.name,
                    },
                    unit_amount : Math.floor(item.price + item.price * 0.02) * 100 
                },
                quantity : item.quantity,
            }
        })

        // Create Session
        const session = await stripeInstance.checkout.sessions.create({
            line_items ,
            mode : "payment" ,
            success_url : `${origin}/loader?next=my-orders`,
            cancel_url : `${origin}/cart`,
            metadata : {
                orderId : order._id.toString(),
                userId,
            }
        })

        return res.json({
            success : true ,
            url : session.url
        })

    } catch (error) {
        console.log(error.message) ;

        return res.json({
            success : false ,
            message : error.message
        })
    }
}


// Stripe Webhooks to Verify Payment Action : /stripe
export const stripeWebhooks = async (req, res) => {
    // stripe gateway Initialize 
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`)
    }

    // handle the event 
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object ;
            const paymentIntentId = paymentIntent.id;

            // getting session MetaData
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const {orderId , userId} = session.data[0].metadata;

            // Mark Payment as paid 
            await Order.findByIdAndUpdate(orderId , {isPaid : true})
            // clear Cart Data
            await User.findByIdAndUpdate(userId , {cartItems : {}});
            break;
        }
        case "payment_intent.payment_failed" : {
            const paymentIntent = event.data.object ;
            const paymentIntentId = paymentIntent.id;

            // getting session MetaData
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const {orderId} = session.data[0].metadata;

            // Delete order for DB as payment is failed
            await Order.findByIdAndDelete(orderId);
            break;
        }
        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }

    res.json({recieved : true}); 

}


// get order detail of individual users
// GET ORDERS BY USER ID : /api/order/user 
export const getUserOrders = async (req ,res) => {
    try {
        const userId = req.userId ;
        // This Says --> Find all orders placed by this userId where payment is either by Cash on Delivery or already paid online.
        const orders = await Order.find({
            userId, 
            $or : [{paymentType : "COD"} , {isPaid : true}]
        }).populate("items.product address").sort({createdAt: -1});
        // Replaces items.product and address references with full documents.
        // Sorts the orders so the most recently created ones come first.

        res.json({
            success : true ,
            orders
        })

    } catch (error) {
        return res.json({
            success : false ,
            message : error.message
        })
    }
}


// ALL ORDER DATA (for admin / seller ) : /api/order/seller
export const getAllOrders = async (req ,res) => {
    try {
        const orders = await Order.find({
            $or : [{paymentType : "COD"} , {isPaid : true}]
        }).populate("items.product address").sort({createdAt: -1});

        res.json({
            success : true ,
            orders
        })

    } catch (error) {
        return res.json({
            success : false ,
            message : error.message
        })
    }
}



