const User = require("../../models/user.model")
const Item = require("../../models/item.model")
const Order = require("../../models/order.model")
const { createOrderValidation,filterOrderValidation, OrderIdValidation } = require('../../validations/order.validation')
const constants = require('../../config/constants.json')
const {getUserId} = require('./auth.controller.js')
const {chargeUser} = require('./transaction.controller.js')

//Create Order
const createOrder = async (req, res) => {
  try {

    // Get User
    const userId = getUserId(req.headers.authorization)
    const user = await User.findById(userId)
        // return If no user is found
    if(!user)
      return res.status(422).json({
        error: constants.errorMessages.noUserFound
      });
    //return error if user cart is empty
    if(user.cart.length === 0)
      return res.status(422).json({error: constants.errorMessages.emptyCart});
          
    // check for items availablity, update Them and calculate total price
    var {totalPrice,errorMsg} =  await getTotalPriceAndUpdateItems(user)
    if(errorMsg)  return res.status(422).json({error: errorMsg});

    const createOrderData = {userId:userId, totalPrice:totalPrice,payment:req.body.payment,items:user.cart}    
    const order = await Order.create(createOrderData)
    await User.updateOne({ '_id': userId }, {cart:[]})
    res.json({msg:constants.errorMessages.success,data:order})  

  }
  catch (error) { 
    res.status(422).json({
    error: error.message
  }); }
};

const processToPaymentOrder = async (req, res) => {

  const { error } = OrderIdValidation(req.body)
  if (error) return res.status(400).json({error:error.details[0].message})
  const order = await Order.findById(req.body.orderId)
  if (!order) return res.status(404).send({ error: constants.errorMessages.noOrderFound })
  if(order.status !== constants.types.orderStatus.pending)
            return res.status(422).send({ error: constants.errorMessages.payForPendingOrdersOnly })
  await Order.updateOne({ '_id': req.body.orderId }, {status:constants.types.orderStatus.paymentProcessing})
  res.json({ msg: constants.errorMessages.success});
}


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
  return {totalPrice:totalPrice}
}

//get Order by id
const getOrderById = (req, res) => {
  //search for the Order with the requested id
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


//get all customer orders
const getAllCustomerOrders = async (req, res) => {

      const userId = getUserId(req.headers.authorization)
      const user = await User.findById(userId)
      if(!user) 
        return res.status(422).json({error: constants.errorMessages.noUserFound});

        // make pagination in order not to load all orders 
      // set default limit to 10 and start page to 1 
      // page and limit are changed to the values provided in the url
      const { page = 1, limit = 10, status } = req.query 
      findQuery = {userId:userId}
      if(status){
        const { error } = filterOrderValidation({status:req.query.status})
        if (error) return res.status(400).json({error:error.details[0].message})
        findQuery.status = req.query.status.toUpperCase()
      }
      // sort the data with the latest come first and return the needed Items and the total number of Items
      Order.find(findQuery).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
        .then((orders) => {
          //Count All Orders
          Order.countDocuments(findQuery).then((count)=>{
            res.json({
              msg:constants.errorMessages.success,
              totalSize: count,
              page:page,
              limit:limit,
              data: orders,
            })
          })
          
        })
        .catch((error) => {
          res.status(400).json({
            error: error.message,
          })
        })
    
}



//get all orders(Only Admin)
const getAllOrders = async (req, res) => {

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
  const { page = 1, limit = 10, status } = req.query 
  findQuery = {}
  if(status){
    const { error } = filterOrderValidation({status:req.query.status})
    if (error) return res.status(400).json({error:error.details[0].message})
    findQuery.status = req.query.status.toUpperCase()
  }
  // sort the data with the latest come first and return the needed Items and the total number of Items
  Order.find(findQuery).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
    .then((orders) => {
      //Count All Orders
      Order.countDocuments(findQuery).then((count)=>{
        res.json({
          msg:constants.errorMessages.success,
          totalSize: count,
          page:page,
          limit:limit,
          data: orders,
        })
      })
      
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message,
      })
    })

}

// Delete Order
const deleteOrder = async (req, res) => {
  try {


          const id = req.params.id;
          const order = await Order.findById(id)
          if (!order) return res.status(404).send({ error: constants.errorMessages.noOrderFound })
          if(order.status !== constants.types.orderStatus.pending)
            return res.status(422).send({ error: constants.errorMessages.deletePendingOrderOnly })
          
            for (let i = 0; i < order.items.length; i++) {
              var item = await Item.findById(order.items[i].item._id)
              await Item.updateOne({ '_id': order.items[i].item._id }, {quantity: item.quantity + order.items[i].count})
            }
          await Order.deleteOne({"_id":id})
          res.json({ msg: constants.errorMessages.success });
  }
  catch (error) {
    res.status(422).json({
      error: error.message
    });
  }
}


module.exports = {
  createOrder,
  getOrderById,
  getAllCustomerOrders,
  getAllOrders,
  processToPaymentOrder,
  deleteOrder,
  processToPaymentOrder
};



