const User = require("../../models/user.model");
const Transaction = require("../../models/transaction.model");
const Item = require("../../models/item.model");
const Order = require("../../models/order.model");
const constants = require('../../config/constants.json')
const uri = require('../../config/uri.json')
const {getUserId} = require('./auth.controller.js')
const axios = require('axios')
const {paymentBackendRequest} = require('../../utils/dto.utils.js')

//Charge user
const chargeUser = async (payment,itemsList,orderId) => {

  try{
      var backendResponse = await chargeUserBackendCall(payment)
      console.log(backendResponse)
      ////////// add logic here //////////////
  }
  catch(error){
    for (let i = 0; i < itemsList.length; i++) {
      await Item.updateOne({ '_id': itemsList[i].item._id }, {quantity: itemsList[i].item.quantity + itemsList[i].count})
    }
    await Order.updateOne({ '_id': orderId },{status:constants.types.orderStatus.paymentFailed,failureReason:error.message})
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
  User.find({id:req.params.id})
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
getAllTransactions =  (req, res) => {
  try {
    // Get User and make sure that user type is admin
    const userId = getUserId(req.headers.authorization)
    User.findById(userId)
      .then(user => {
        // return If no user is found
        if(!user)
          return res.status(422).json({
            error: constants.errorMessages.noUserFound
          });
          //Forbidden if user type is not an admin
          if(user.type !== constants.types.user.admin)
            return res.status(403).json({
              error: constants.errorMessages.forbidden
            });
          //get all Transactions
           Transaction.find().then((transactions) => {
            return res.json({ data: transactions })
          })
           
      })
  }
  catch (error) { res.status(422).json({
    error: error.message
  }); }
};

//get a User all his transactions
getCustomerTransactions =  (req, res) => {
  try {
    // Get UserId
    const userId = getUserId(req.headers.authorization)
    User.findById(userId)
      .then(user => {
        // return If no user is found
        if(!user)
          return res.status(422).json({
            error: constants.errorMessages.noUserFound
          });
          //get all Transactions
           Transaction.find({userId:userId}).then((transactions) => {
            return res.json({ data: transactions })
          })
           
      })
  }
  catch (error) { res.status(422).json({
    error: error.message
  }); }
};


module.exports = {
  chargeUser,
  getTransactionById,
  getAllTransactions,
  getCustomerTransactions
};



