const User = require("../../models/user.model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { createUserValidation,updateUserValidation } = require('../../validations/user.validation')
const constants = require('../../config/constants.json')
const {getUserId} = require('./auth.controller.js')


//Create Customer
const createCustomer = async (req, res) => {
  //check if any attribute in the request body violates the attributes constraints
  const { error } = createUserValidation(req.body)
  if (error) return res.status(400).json({error:error.details[0].message})
  //hash the store password
  const salt =  bcrypt.genSaltSync(10)
  const hachedPassword =  bcrypt.hashSync(req.body.password, salt)
  req.body.password = hachedPassword

  //create new User with the given data and return the new user id and a token for the user 
  await User.create(req.body)
    .then(createdTarget => {
      const token = jwt.sign({ userId: createdTarget._id, userType:createdTarget.type}, process.env.TOKEN)
      res.json({
        msg: constants.errorMessages.success,
        id: createdTarget._id,
        name:createdTarget.username,
        token: token
      });
    },
    )
    .catch(error => {
      res.status(422).json({
        error: error.message
      });
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
const getAllCustomers =  (req, res) => {
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
          //get all Customers
           User.find({type:constants.types.user.customer}).then((users) => {
            return res.json({ data: users })
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
      err: error.message
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


module.exports = {
  createCustomer,
  getUserById,
  updateUser,
  deleteUser,
  getAllCustomers
};



