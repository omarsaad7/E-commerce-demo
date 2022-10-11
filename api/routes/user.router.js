const express = require("express")
const router = express.Router()
const Controller = require("../controllers/user.controller")
const verify = require("../controllers/verifyToken.controller")
const uri = require('../../config/uri.json')

const {
  createCustomer,
  getUserById,
  updateUser,
  deleteUser,
  getAllCustomers
} = Controller

router.post(uri.user.api.createCustomer, createCustomer)
router.put(uri.user.api.updateUser,verify,updateUser) 
router.delete(uri.user.api.deleteUser, verify, deleteUser)
router.get(uri.user.api.getUserById, verify, getUserById)
router.get(uri.user.api.getAllCustomers,verify,getAllCustomers)



module.exports = router