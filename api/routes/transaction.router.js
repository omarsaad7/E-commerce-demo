const express = require("express")
const router = express.Router()
const Controller = require("../controllers/transaction.controller")
const verify = require("../controllers/verifyToken.controller")
const uri = require('../../config/uri.json')

const {
  chargeUser,
  getTransactionById,
  getAllTransactions,
  getCustomerTransactions
} = Controller

router.post(uri.transaction.api.charge,verify ,chargeUser)
router.get(uri.transaction.api.getTransactionById,verify,getTransactionById) 
router.get(uri.transaction.api.getAllTransactions, verify, getAllTransactions)
router.get(uri.transaction.api.getAllCustomerTransactions,verify,getCustomerTransactions)



module.exports = router