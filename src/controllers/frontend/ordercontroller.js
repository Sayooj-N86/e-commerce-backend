import env from '../../../env.js';
import { OrderModel } from '../../models/OrderModel.js';
import { productModel } from '../../models/ProductModel.js';
import { serverError } from '../../utils/ErrorHandler.js';
import Stripe from 'stripe';

export const createOrder = async (req, res, next) => {
   try {
    const { billingDetails, items} = req.body;
// console.log(items);
    const  {adminId}  = req.user;

    if(!items){
        return res.status(400).json({message: 'Items are required'});
    }

    const shippingCost = 30;

    const productIds = items.map((item) => item.id);

    const matchedProducts = [];

    for(const productId of productIds){
        const products = await  productModel.find({ _id:productId, deleteAt:null}).lean();
        matchedProducts.push(...products);
    }

    if (matchedProducts.length !== items.length){
        return res.status(400).json({
            success:false,
            message: 'all Product not found',
            data:{},
        });
    }

    let total = 0;

    const orderItems = items.map((cartItem) => {
        const price = matchedProducts.find((item) => item._id.toString() === cartItem.id.toString())?.price;
        total = total + cartItem.quantity * price;

        return {
            productId: cartItem.id,
            quantity: cartItem.quantity,
            price: price,
    };
});
    const tax = total * 0.18;
    const grandTotal = total + tax + shippingCost;

    const order = await OrderModel.create({
        billingDetails:billingDetails,
        items:orderItems,
        shippingCost: shippingCost,
        tax: tax,
        grandTotal: grandTotal,
        subTotal:total,
        userId: adminId,
    });

    return res.status(200).json({
        success:true,
        message: 'Order created successfully',
        data:{
            orderId:order._id,
        }
    });
}
catch(err){
    next(serverError());
    // console.log(err);
}


};


export const payment = async ( req, res, next)  => {
    try{
        const stripe = Stripe(env.STRIPE_SECRET_KEY);

        const {orderId} = req.query;

        const order = await OrderModel.findOne({ _id: orderId });

        const customer = await stripe.customers.create({
            name:order.billingDetails.name,
            address:{
                line1:order.billingDetails.address,
                city:'kannur',
                state:'kerala',
                postal_code:order.billingDetails.pincode,
                country:'India'
            },
        });

        

        const session = await stripe.paymentIntents.create({
            customer: customer.id,
            amount:order.grandTotal * 100,
            currency: 'inr',
            shipping:{
                name:order.billingDetails.name,
                address:{
                    line1:order.billingDetails.address,
                    city:'kannur',
                    state:'kerala',
                    postal_code:order.billingDetails.pincode,
                    country:'India' 
                    },
            },
            automatic_payment_methods:{
                enabled:true,
            },
            description:'order',
            metadata:{
                orderId:orderId.toString(),
            },
            receipt_email:order.email,
        });

        return res.status(200).json({
            success:true,
            message:'payment  created',
            data:{
                sessionId: session.client_secret,
                amount: order.grandTotal,
            },
        });


    }
    catch(err){
        console.log(err);
        next(serverError());
    }
};