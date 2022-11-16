
const itemResolver = require('./item.resolver')
const authResolver = require('./auth.resolver')
const userResolver = require('./user.resolver')

const rootResolver = {
     ...itemResolver,
     ...authResolver,
     ...userResolver
}
module.exports = rootResolver