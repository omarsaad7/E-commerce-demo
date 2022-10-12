const User = require("../../models/user.model");
const Transaction = require("../../models/transaction.model");
const Item = require("../../models/item.model");
const Order = require("../../models/order.model");
const constants = require('../../config/constants.json')
const uri = require('../../config/uri.json')
const {getUserId} = require('./auth.controller.js')
const axios = require('axios')
const {paymentBackendRequest,createTransactionDto} = require('../../utils/dto.utils.js')

//Charge user
const chargeUser = async (payment,itemsList,orderId,userId) => {

  try{
      var backendResponse = await chargeUserBackendCall(payment)
      var transactionObject = createTransactionDto(backendResponse,orderId,userId)
      const transaction = await Transaction.create(transactionObject)
      await Order.updateOne({ '_id': orderId },{transactionId:transaction._id,status:constants.types.orderStatus.paid,receiptUrl: transaction.receipt_url})
  }
  catch(error){
    var msg = error.message
    if(error.response && error.response.data && error.response.data.error && error.response.data.error.message)
      msg = error.response.data.error.message
    for (let i = 0; i < itemsList.length; i++) {
      var item = await Item.findById(itemsList[i].item._id)
      await Item.updateOne({ '_id': itemsList[i].item._id }, {quantity: item.quantity + itemsList[i].count})
    }
    await Order.updateOne({ '_id': orderId },{status:constants.types.orderStatus.paymentFailed,failureReason:msg})
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
        // make pagination in order not to load all orders 
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
            err: error.message,
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
            err: error.message,
          })
        })
};


module.exports = {
  chargeUser,
  getTransactionById,
  getAllTransactions,
  getCustomerTransactions
};



