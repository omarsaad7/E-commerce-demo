const express = require("express")
const router = express.Router()
const Controller = require("../controllers/order.controller")
const verify = require("../controllers/verifyToken.controller")
const uri = require('../../config/uri.json')

const {
  createOrder,
  getOrderById,
  getAllCustomerOrders
} = Controller

router.post(uri.order.api.createOrder,verify ,createOrder)
router.get(uri.order.api.getOrderById,verify,getOrderById) 
// router.get(uri.transaction.api.getAllTransactions, verify, getAllTransactions)
router.get(uri.order.api.getUserOrders,verify,getAllCustomerOrders)



module.exports = router