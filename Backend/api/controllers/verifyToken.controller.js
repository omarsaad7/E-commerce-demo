const { id } = require("@hapi/joi/lib/base");
const jwt = require("jsonwebtoken")
const constants = require('../../config/constants.json')
module.exports = async function (req, res, next) {

    
    var token = req.headers.authorization
    if (!token)
        return res.status(401).send({error:constants.errorMessages.unauthorized})
    try {
        token = token.replace('Bearer ','')
        const verified = jwt.verify(token, process.env.TOKEN)
        req.user = verified
        next()

    }
    catch (error) {
        res.status(403).send({error:constants.errorMessages.forbidden})
    }

}