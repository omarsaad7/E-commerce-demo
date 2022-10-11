const jwt = require("jsonwebtoken")
const constants = require('../../config/constants.json')

module.exports = function (req, res, next) {

    const token = req.headers.authorization.replace('Bearer ','')
    if (!token)
        return res.status(401).send({error:constants.errorMessages.unauthorized})
    try {
        const verified = jwt.verify(token, process.env.TOKEN)
        req.user = verified
        next()
    }
    catch (error) {
        res.status(403).send({error:constants.errorMessages.forbidden})
    }

}