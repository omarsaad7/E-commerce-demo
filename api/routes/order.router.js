const express = require("express")
const router = express.Router()
const Controller = require("../controllers/order.controller")
const verify = require("../controllers/verifyToken.controller")
const uri = require('../../config/uri.json')

const {
  createOrder,
  getOrderById,
  getAllCustomerOrders,
  getAllOrders,
  deleteOrder,
  processToPaymentOrder
} = Controller

router.post(uri.order.api.createOrder,verify ,createOrder)
router.get(uri.order.api.getOrderById,verify,getOrderById) 
router.get(uri.order.api.getAllOrders, verify, getAllOrders)
router.get(uri.order.api.getUserOrders,verify,getAllCustomerOrders)
router.delete(uri.order.api.deleteOrder,verify,deleteOrder)
router.post(uri.order.api.processToPayment,verify ,processToPaymentOrder)



module.exports = router