
const Controller = require("../../api/controllers/user.controller")
const constants = require('../../config/constants.json')

const {
  createCustomer,
  getUserById,
  updateUser,
  deleteUser,
  getAllCustomers,
  addItem,
  removeItem
} = Controller
module.exports = {
  createCustomer: async (args,req) => {
      if(!(req.isAuth && req.isAdmin)){
        throw new Error(constants.errorMessages.adminOnly)
      }
      return await createCustomer(args.createCustomerInput) 
    }
  }