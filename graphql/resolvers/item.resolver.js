const Item = require('../../models/item.model.js')
const Controller = require("../../api/controllers/item.controller")
const {
    createItem,
    getItemById,
    getAllItems,
    deleteItem,
    updateItem
  } = Controller

module.exports = {
    items: async (args) => {
      console.log(args)
      return await getAllItems(args)
    },
    item: async (args) => {
        return await getItemById(args.id) 
      },
    createItem: (args, req) => {
      const item = new Item({
        name: args.itemInput.name,
        description: args.itemInput.description,
        img: args.itemInput.img,
        quantity: args.itemInput.quantity,
        price: args.itemInput.price
      })
      item.save()
      return item;
    }
  }