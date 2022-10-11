const Joi = require('joi')
const Constants = require('../config/constants.json')
module.exports = {
    
    createUserValidation : User => {
        const userSchema = Joi.object({
            username:Joi.string().pattern(new RegExp(Constants.regex.usernameRegex)).messages({'string.pattern.base': Constants.errorMessages.usernameValidation}).required(),
            password: Joi.string().pattern(new RegExp(Constants.regex.passwordRegex)).messages({'string.pattern.base': Constants.errorMessages.passwordValidation}).required()
            })

            return userSchema.validate(User)
    },

    updateUserValidation : User => {
        const userSchema = Joi.object({
            username:Joi.string().pattern(new RegExp(Constants.regex.usernameRegex)).messages({'string.pattern.base': Constants.errorMessages.usernameValidation}),
            password: Joi.string().pattern(new RegExp(Constants.regex.passwordRegex)).messages({'string.pattern.base': Constants.errorMessages.passwordValidation})
            })

            return userSchema.validate(User)
    }
}
   