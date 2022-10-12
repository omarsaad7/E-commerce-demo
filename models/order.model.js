const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require('../config/constants.json')

// Payment Schema
const payment = new Schema(
  {
    amount: Number,
    expMonth: Number,
    expYear: Number,
    currency: String,
    cardNumber: String,
    cvc: String
  },
  {
    timestamps: false
  }
);


const orderSchema = new Schema(
  {
    userId:
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required : true
    },
    totalPrice: { type : Number , required : true},
    payment: payment,
    status:{
      type: String,
      enum : [constants.types.orderStatus.pending,constants.types.orderStatus.paid,constants.types.orderStatus.paymentFailed],
      default: constants.types.orderStatus.pending
  },
  failureReason: String,
  transactionId:
    {
      type: String,
      ref: 'Transaction'
    },
    receiptUrl:String
  },
  {
    timestamps: true
  }
);
orderSchema.index({
  "$**": "text"
});

module.exports = Order = mongoose.model("Order", orderSchema);
