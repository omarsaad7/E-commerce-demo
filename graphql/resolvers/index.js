
const itemResolver = require('./item.resolver')
const authResolver = require('./auth.resolver')
const userResolver = require('./user.resolver')
const transactionResolver = require('./transaction.resolver')

const rootResolver = {
     ...itemResolver,
     ...authResolver,
     ...userResolver,
     ...transactionResolver
}
module.exports = rootResolver