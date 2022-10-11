const User = require("../../models/user.model");
const Transaction = require("../../models/transaction.model");
const { chargeValidation} = require('../../validations/transaction.validation')
const constants = require('../../config/constants.json')
const uri = require('../../config/uri.json')
const {getUserId} = require('./auth.controller.js')
const axios = require('axios')
const {paymentBackendRequest} = require('../../utils/dto.utils.js')
//Charge user
const chargeUser = async (req, res) => {

  //check if any attribute in the request body violates the attributes constraints
  try{
    chargeValidation(req.body)
  }
  catch(error) {
        return res.status(400).json({
          error: error.message
        });
      }

      chargeUserBackendCall(req.body,res)
      

  //create new Transaction and return the Transaction details
  // await Transaction.create(req.body)
  //   .then(createdTarget => {
  //     res.json({
  //       msg: constants.errorMessages.success,
  //       data: createdTarget
  //     });
  //   },
  //   )
  //   .catch(error => {
  //     res.status(422).json({
  //       error: error.message
  //     });
  //   });

};

const chargeUserBackendCall = async (body,res) => {
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
   axios(config)
   .then( (response) =>  {
    res.json({
      msg: constants.errorMessages.success,
      data: response.data
    });
   })
   .catch( (error) =>{
    res.status(422).json({
            error: error.message
          });
   });
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



