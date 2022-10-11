const User = require("../../models/user.model");
const Item = require("../../models/item.model");
const { updateItemValidation,createItemValidation } = require('../../validations/item.validation')
const constants = require('../../config/constants.json')
const {getUserId} = require('./auth.controller.js')


//Create Item (Only Admin)
const createItem = async (req, res) => {
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

          //check if any attribute in the request body violates the attributes constraints
          const { error } = createItemValidation(req.body)
          if (error) return res.status(400).json({error:error.details[0].message})

          //create new Item with the given data and return the new user id and a token for the user 
           Item.create(req.body)
            .then(createdTarget => {
              return res.json({
                msg: constants.errorMessages.success,
                data: createdTarget
              });
            }
            )
      })
  }
  catch (error) { res.status(422).json({
    error: error.message
  }); }
};


//get item by id (No Auth required)
const getItemById = (req, res) => {
  //search for the Item with the requested id
  Item.findById(req.params.id)
  .then(foundTarget => {
    // Throw Error if no user is found
    if(!foundTarget)
      throw new Error(constants.errorMessages.noUserFound);
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

//Update Item (Only Admin)
const updateItem = async (req, res) => {
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
 
           //check if any attribute in the request body violates the attributes constraints
           const { error } = updateItemValidation(req.body)
           if (error) return res.status(400).json({error:error.details[0].message})
 
           const targetId = req.params.id;
           const item = await Item.findById(targetId)
           if (!item) return res.status(404).send({ error: constants.errorMessages.noItemFound })
           await Item.updateOne({ '_id': targetId }, req.body)
           res.json({ msg: constants.errorMessages.success});
           
       })
  }
  catch (error) {
    res.status(422).json({
      err: error.message
    });
  }
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
  createItem,
  getItemById,
  getAllItems,
  deleteItem,
  updateItem
};



