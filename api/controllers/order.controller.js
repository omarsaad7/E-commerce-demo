const User = require("../../models/user.model")
const Item = require("../../models/item.model")
const Order = require("../../models/order.model")
const { deleteOrderValidation,createOrderValidation } = require('../../validations/order.validation')
const { chargeValidation } = require('../../validations/transaction.validation')
const constants = require('../../config/constants.json')
const {getUserId} = require('./auth.controller.js')
const {chargeUser} = require('./transaction.controller.js')

//Create Order
const createOrder = async (req, res) => {
  try {

    //check if any attribute in the payment violates the attributes constraints
  try{
    chargeValidation(req.body.payment)
  }
  catch(error) {
        return res.status(400).json({
          error: error.message
        });
      }
    // Get User
    const userId = getUserId(req.headers.authorization)
    User.findById(userId)
      .then(async (user) => {
        // return If no user is found
        if(!user)
          return res.status(422).json({
            error: constants.errorMessages.noUserFound
          });
          //return error if user cart is empty
          if(user.cart.length === 0)
            return res.status(422).json({error: constants.errorMessages.emptyCart});
          
          // check for items availablity, update Them and calculate total price
          var {totalPrice, itemsList,errorMsg} =  await getTotalPriceAndUpdateItems(user)
          if(errorMsg)  return res.status(422).json({error: errorMsg});

          const createOrderData = {userId:userId, totalPrice:totalPrice,payment:req.body.payment}
          // check if any attribute in the request body violates the attributes constraints
          const { error } = createOrderValidation(createOrderData)
          if (error) return res.status(400).json({error:error.details[0].message})
          
          const order = await Order.create(createOrderData)
          res.json({msg:constants.errorMessages.success,data:order})

          chargeUser(req.body.payment,itemsList,order._id,userId)

      })
  }
  catch (error) { 
    res.status(422).json({
    error: error.message
  }); }
};

const getTotalPriceAndUpdateItems = async (user) => {
  // check for items availablity
  var totalPrice = 0
  var itemsList = []
  for (let i = 0; i < user.cart.length; i++) {
    var item = await Item.findById(user.cart[i].item._id)
    if(item.quantity < user.cart[i].count){
      return {errorMsg:item.name + constants.errorMessages.itemNotAvailable}
    }
    itemsList.push({item:item,count: user.cart[i].count})
  }

  // update items quantity and calculate total price
  for (let i = 0; i < itemsList.length; i++) {
    await Item.updateOne({ '_id': itemsList[i].item._id }, {quantity: itemsList[i].item.quantity - itemsList[i].count})
    totalPrice = totalPrice + (itemsList[i].item.price * itemsList[i].count)
  }
  return {totalPrice:totalPrice, itemsList:itemsList}
}

//get item by id (No Auth required)
const getOrderById = (req, res) => {
  //search for the Item with the requested id
  Order.findById(req.params.id)
  .then(foundTarget => {
    // Throw Error if no user is found
    if(!foundTarget)
      throw new Error(constants.errorMessages.noOrderFound);
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


//get all items (No Auth required)
const getAllItems =  (req, res) => {
  
      // make pagination in order not to load all items 
      // set default limit to 10 and start page to 1 
      // page and limit are changed to the values provided in the url
      const { page = 1, limit = 10 } = req.query
      // sort the data with the latest come first and return the needed Items and the total number of Items
      Item.find().sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
        .then((items) => {
          //Count All Items
          Item.countDocuments().then((count)=>{
            res.json({
              msg:constants.errorMessages.success,
              totalSize: count,
              page:page,
              limit:limit,
              data: items,
            })
          })
          
        })
        .catch((error) => {
          res.status(400).json({
            err: error.message,
          })
        })
    
}

// Delete Item (Only Admin)
const deleteItem = async (req, res) => {
  try {
    // Get User and make sure that user type is admin
    const userId = getUserId(req.headers.authorization)
    User.findById(userId)
      .then(async (user) => {
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

          const id = req.params.id;
          const deletedTarget = await Item.findByIdAndRemove(id)
          if (!deletedTarget) return res.status(404).send({ error: constants.errorMessages.noItemFound })
          res.json({ msg: constants.errorMessages.success });
          })
  }
  catch (error) {
    res.status(422).json({
      error: error.message
    });
  }
}


module.exports = {
  createOrder,
  getOrderById
};



