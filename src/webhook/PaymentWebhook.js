import env from '../../env.js';
import stripePackage from 'stripe';
import { serverError } from '../utils/ErrorHandler.js';
import { OrderModel } from '../models/OrderModel.js';


export const createWebhook = async (req, res, next) =>{
    try {
        // console.log('helloooo');
        const stripe = stripePackage(env.STRIPE_SECRET_KEY);
        // console.log('stripe:::;',stripe);


        let event = req.body;
        // console.log('event::::1:::::::::::::',event );

        const endpoint = (env.ENDPOINT_SECRET);
        if(endpoint){
            const signature = req.headers['stripe-signature'];
            try{
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    endpoint
                );
                // console.log('event2::::::::::',event);
                }
                catch(error){
                    return res.status(400);
            }
        }
        const {orderId} = event.data.object.metadata;
    // console.log('metadata::::::',metadata);
        let paymentIntent;
        let order;
        switch(event.type){

            case 'payment_intent.created':
                paymentIntent = event.data.object;
                console.log('paymentIntent was created',paymentIntent);
                break;
            case 'payment_intent.succeeded':
                paymentIntent = event.data.object;
                 order= await OrderModel.findOne({
                    _id:orderId,
                });
                order.payment.payment_order_Id = paymentIntent.id;
                order.payment.paymentStatus = 'successs';
                order.payment.updatedon = new Date();
                await order.save();
                console.log('orderId::::::',order);
                console.log('paymentIntent was successsfull',paymentIntent);
                break;
            case 'payment_intent.payment_failed':
                paymentIntent = event.data.object;
                order= await OrderModel.findOne({
                    _id:orderId,
                    });
                    order.payment.payment_order_Id = paymentIntent.id;
                    order.payment.paymentStatus = 'failed';
                    order.payment.updatedon = new Date();
                    await order.save();
                    console.log('order:::::::::,',order);
                console.log('paymentIntent was failed',paymentIntent);
               
                break;
            default:
                console.log('unknown event type');
        }
        
}
catch (error) {
   return  next(serverError(error));
    }
};