const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);
const constants = require('../config/constants.json')

module.exports = {
    
          idValidation : id => {
            const idSchema = Joi.object({
                id:Joi.objectId().required()
                })
                
                return idSchema.validate(id)
            }
}
   