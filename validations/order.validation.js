const Joi = require('joi')
const constants = require('../config/constants.json')

module.exports = {
    
     createOrderValidation : Order => {
        const orderSchema = Joi.object({
            userId:Joi.required(),
            payment:Joi.required(),
            status: Joi.forbidden(),
            totalPrice:Joi.number().integer().min(1).max(1.7976931348623157e+308).required()
            })

            return orderSchema.validate(Order)
        },

        deleteOrderValidation : Order => {
            const orderSchema = Joi.object({
                status:Joi.string().valid(constants.types.orderStatus.pending).required()
                })
    
                return orderSchema.validate(Order)
            }
}
   