const User = require("../../models/user.model");
const Transaction = require("../../models/transaction.model");
const Item = require("../../models/item.model");
const Order = require("../../models/order.model");
const constants = require('../../config/constants.json')
const uri = require('../../config/uri.json')
const {getUserId} = require('./auth.controller.js')
const axios = require('axios')
const {paymentBackendRequest,createTransactionDto} = require('../../utils/dto.utils.js')
const { chargeValidation } = require('../../validations/transaction.validation')

//Charge user
const chargeUser = async (req, res) => {
  
    try{
      chargeValidation(req.body)
    }
    catch(error) {
          return res.status(400).json({
            error: error.message
          });
        }

    const userId = getUserId(req.headers.authorization)
    const user = await User.findById(userId)
    if(!user) 
      return res.status(422).json({error: constants.errorMessages.noUserFound});
    const order = await Order.findById(req.body.orderId)
    if(!order) 
      return res.status(422).json({error: constants.errorMessages.noOrderFound});
    if(order.status !== constants.types.orderStatus.paymentProcessing)
      return res.status(422).send({ error: constants.errorMessages.chargeForProcessingPaymentOrdersOnly }) 

    // Accept request and Return 202
    res.status(202).json({msg: constants.errorMessages.paymentRequestAccepted,data:order});

    try{

      var backendResponse = await chargeUserBackendCall(req.body.payment)
      var transactionObject = createTransactionDto(backendResponse,req.body.orderId,userId)
      const transaction = await Transaction.create(transactionObject)
      await Order.updateOne({ '_id': req.body.orderId },{transactionId:transaction._id,status:constants.types.orderStatus.paid,receiptUrl: transaction.receipt_url})
  }
  catch(error){
    var msg = error.message
    if(error.response && error.response.data && error.response.data.error && error.response.data.error.message)
      msg = error.response.data.error.message
    for (let i = 0; i < order.items.length; i++) {
      var item = await Item.findById(order.items[i].item._id)
      await Item.updateOne({ '_id': order.items[i].item._id }, {quantity: item.quantity + order.items[i].count})
    }
    await Order.updateOne({ '_id': req.body.orderId },{status:constants.types.orderStatus.paymentFailed,failureReason:msg})
  }

};

const chargeUserBackendCall = async (body) => {
  const url = uri.transaction.backend.host + uri.transaction.backend.api.charge
  var data = paymentBackendRequest(body)

   var config = {
     method: constants.apiMethods.post,
     url: url,
     headers: { 
      Authorization: process.env.STRIPEAUTHHEADER, 
      'Content-Type': constants.headers.contentTypeUrlEncoded
     },
     data : data
   };
   return axios(config)
   .then( (response) =>  {
    return response.data
   })
}



//get Transaction by id
const getTransactionById = (req, res) => {
  //search for the Transaction with the requested id
  Transaction.findById(req.params.id)
  .then(foundTarget => {
    // Throw Error if no transaction is found
    if(!foundTarget)
      throw new Error(constants.errorMessages.noTransactionFound);
    res.json({
      msg: constants.errorMessages.success,
      data: foundTarget
    });
  })
  .catch(error => {
    res.status(422).json({
      error: error.message
    });
  });
};



//get all Transactions (Only Admins can access this api)
getAllTransactions = async (req, res) => {

    const userId = getUserId(req.headers.authorization)
      const user = await User.findById(userId)
      if(!user) 
        return res.status(422).json({error: constants.errorMessages.noUserFound});
      if(user.type !== constants.types.user.admin)
        return res.status(403).json({
          error: constants.errorMessages.forbidden
        });
        // make pagination in order not to load all transactions 
      // set default limit to 10 and start page to 1 
      // page and limit are changed to the values provided in the url
      const { page = 1, limit = 10 } = req.query
      // sort the data with the latest come first and return the needed Items and the total number of Items
      Transaction.find().sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
        .then((transactions) => {
          //Count All Transactions
          Transaction.countDocuments().then((count)=>{
            res.json({
              msg:constants.errorMessages.success,
              totalSize: count,
              page:page,
              limit:limit,
              data: transactions,
            })
          })
          
        })
        .catch((error) => {
          res.status(400).json({
            error: error.message,
          })
        })
}


//get a User all his transactions
getCustomerTransactions = async (req, res) => {
      const userId = getUserId(req.headers.authorization)
      const user = await User.findById(userId)
      if(!user) 
        return res.status(422).json({error: constants.errorMessages.noUserFound});

        // make pagination in order not to load all orders 
      // set default limit to 10 and start page to 1 
      // page and limit are changed to the values provided in the url
      const { page = 1, limit = 10 } = req.query
      // sort the data with the latest come first and return the needed Items and the total number of Items
      Transaction.find({userId:userId}).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
        .then((transactions) => {
          //Count All Transactions
          Transaction.countDocuments({userId:userId}).then((count)=>{
            res.json({
              msg:constants.errorMessages.success,
              totalSize: count,
              page:page,
              limit:limit,
              data: transactions,
            })
          })
          
        })
        .catch((error) => {
          res.status(400).json({
            error: error.message,
          })
        })
};


module.exports = {
  chargeUser,
  getTransactionById,
  getAllTransactions,
  getCustomerTransactions
};



