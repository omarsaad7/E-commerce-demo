const express = require("express")
const router = express.Router()
const Controller = require("../controllers/item.controller")
const verify = require("../controllers/verifyToken.controller")
const uri = require('../../config/uri.json')

const {
  createItem,
  getItemById,
  getAllItems,
  deleteItem,
  updateItem
} = Controller

router.post(uri.item.api.createItem,verify ,createItem)
router.put(uri.item.api.updateItem,verify,updateItem) 
router.delete(uri.item.api.deleteItem, verify, deleteItem)
router.get(uri.item.api.getItemById, getItemById)
router.get(uri.item.api.getAllItems,getAllItems)



module.exports = router