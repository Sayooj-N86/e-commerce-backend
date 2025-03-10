import mongoose from 'mongoose';
import AutoIncrementInc from 'mongoose-sequence';
const AutoIncrement = AutoIncrementInc(mongoose);

const OrderSchema = new mongoose.Schema(
	{
		orderNumber: {
			type: Number,
			required: false,
		},
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		items: [
			{
				productId: {
					type: mongoose.Types.ObjectId,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		subTotal: {
			type: Number,
			required: true,
		},
		grandTotal: {
			type: Number,
			required: true,
		},
		tax: {
			type: Number,
			required: true,
		},
		billingDetails: {
			name: {
				type: String,
				required: true,
			},
			name1: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			phone: {
				type: Number,
				required: true,
			},
			address: {
				type: String,
				required: true,
			},
			pincode: {
				type: Number,
				required: true,
			},
		},
		payment:{
			payment_order_Id:{
				type:String,
				required:false,
			},
			paymentStatus:{
				type:String,
				default:'created',
			},
			updatedon:{
				type:Date,
				required:false,
			},
		},
		deleteAt: {
			type: Date,
			required: false,
			default: null,
		},
	},
	{ timestamps: true },
);
OrderSchema.plugin(AutoIncrement, {
	inc_field: 'orderNumber',
	startAt: 1,
});
export const OrderModel = mongoose.model('orders', OrderSchema);
