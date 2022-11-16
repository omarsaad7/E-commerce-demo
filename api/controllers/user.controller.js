const User = require("../../models/user.model");
const Item = require("../../models/item.model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { createUserValidation,updateUserValidation,addItemValidation,removeItemValidation} = require('../../validations/user.validation')
const constants = require('../../config/constants.json')
const {getUserId} = require('./auth.controller.js')


//Create Customer
const createCustomer = async (data) => {
  //check if any attribute in the request body violates the attributes constraints
  const { error } = createUserValidation(data)
  if (error) throw new Error(error.details[0].message)
  //Check if username already exists
  const user = await User.findOne({ username: data.username })
  if (user)
    throw new Error(constants.errorMessages.usernameAlreadyExists)
  //hash the store password
  const salt =  bcrypt.genSaltSync(10)
  const hachedPassword =  bcrypt.hashSync(data.password, salt)
  data.password = hachedPassword

  //create new User with the given data and return the new user id and a token for the user 
  return await User.create(data)
    .then(createdTarget => {
      const token = jwt.sign({ userId: createdTarget._id, userType:createdTarget.type}, process.env.TOKEN)
      return {
        userId: createdTarget._id,
        name:createdTarget.username,
        token: token
      }
    },
    )
    .catch(error => {
      throw new Error(error.message)
    });

};


//get Customer by id
const getUserById = (req, res) => {
  //search for the User with the requested id
  User.findById(req.params.id)
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


//get all users (Only Admins can access this api)
const getAllCustomers = async (req, res) => {
  try {
    // Get User and make sure that user type is admin
    const userId = getUserId(req.headers.authorization)
    const user = await User.findById(userId)
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

        // make pagination in order not to load all customers 
      // set default limit to 10 and start page to 1 
      // page and limit are changed to the values provided in the url
      const { page = 1, limit = 10 } = req.query
      // sort the data with the latest come first and return the needed Items and the total number of Items
      User.find({type:constants.types.user.customer}).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
        .then((users) => {
          //Count All Transactions
          User.countDocuments({type:constants.types.user.customer}).then((count)=>{
            res.json({
              msg:constants.errorMessages.success,
              totalSize: count,
              page:page,
              limit:limit,
              data: users,
            })
          })
          
        })
        .catch((error) => {
          res.status(400).json({
            error: error.message,
          })
        })

  }
  catch (error) { res.status(422).json({
    error: error.message
  }); }
};


const updateUser = async (req, res) => {
  try {
    //make sure that type is not required to be changed
    if(req.body.type)
      return res.status(400).json({
        error: constants.errorMessages.userTypeCannotBeChanged
      });
    
    // Validate request body
    const { error } = updateUserValidation(req.body)
    if (error) return res.status(400).json({error:error.details[0].message})

    //find the user given it's id in the request url then update its data with the data provided in the request body
    const targetId = req.params.id;
    if(req.body.password){
      //hash the store password
      const salt =  bcrypt.genSaltSync(10)
      const hachedPassword =  bcrypt.hashSync(req.body.password, salt)
      req.body.password = hachedPassword
    }
    const user = await User.findById(targetId)
    if (!user) return res.status(404).send({ error: constants.errorMessages.noUserFound })
    await User.updateOne({ '_id': targetId }, req.body)
    res.json({ msg: constants.errorMessages.success});
  }
  catch (error) {
    res.status(422).json({
      error: error.message
    });
  }
}

const deleteUser = async (req, res) => {
  try {

    const id = req.params.id;
    const deletedTarget = await User.findByIdAndRemove(id)
    if (!deletedTarget) return res.status(404).send({ error: constants.errorMessages.noUserFound })
    res.json({ msg: constants.errorMessages.success });
  }
  catch (error) {
    res.status(422).json({
      error: error.message
    });
  }
}

//add Item to cart
const addItem =  (req, res) => {
  try {
    // Validate Request Body
    const { error } = addItemValidation(req.body)
    if (error) return res.status(400).json({error:error.details[0].message})
    // Get User 
    const userId = getUserId(req.headers.authorization)
    User.findById(userId)
      .then(user => {
        // return If no user is found
        if(!user)
          return res.status(404).json({
            error: constants.errorMessages.noUserFound
          });

          // Get Item
          Item.findById(req.body.itemId)
          .then(async (item) => {
            if(!item)
            return res.status(404).json({
              error: constants.errorMessages.noItemFound
            });
            for (let i = 0; i <  user.cart.length; i++) {
              if(user.cart[i].item._id.toString()===item._id.toString()){
                user.cart[i].count = user.cart[i].count + req.body.count
                await User.updateOne({ '_id': userId }, {cart:user.cart})
                return res.json({ msg: constants.errorMessages.success});
              }
            }
            user.cart.push({item:item,count:req.body.count})
            await User.updateOne({ '_id': userId }, {cart:user.cart})
            res.json({ msg: constants.errorMessages.success});
          })
           
      })
  }
  catch (error) { res.status(422).json({
    error: error.message
  }); }
};



//add Item to cart
const removeItem =  (req, res) => {
  try {
    // Validate Request Body
    const { error } = removeItemValidation(req.body)
    if (error) return res.status(400).json({error:error.details[0].message})
    // Get User 
    const userId = getUserId(req.headers.authorization)
    User.findById(userId)
      .then(user => {
        // return If no user is found
        if(!user)
          return res.status(404).json({
            error: constants.errorMessages.noUserFound
          });

          // Get Item
          Item.findById(req.body.itemId)
          .then(async (item) => {
            if(!item)
            return res.status(404).json({
              error: constants.errorMessages.noItemFound
            });
            for (let i = 0; i <  user.cart.length; i++) {
              if(user.cart[i].item._id.toString()===item._id.toString()){
               
                user.cart.splice(i, 1)
                await User.updateOne({ '_id': userId }, {cart:user.cart})
                return res.json({ msg: constants.errorMessages.success});
              }
            }
            res.status(422).json({
              error: constants.errorMessages.itemNotInCart
            })
          })
           
      })
  }
  catch (error) { res.status(422).json({
    error: error.message
  }); }
};

module.exports = {
  createCustomer,
  getUserById,
  updateUser,
  deleteUser,
  getAllCustomers,
  addItem,
  removeItem
};



