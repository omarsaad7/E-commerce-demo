const { buildSchema } = require('graphql');
const {itemSchemas , itemRootQuery, itemRootMutation} = require('./item.schema')
const {authSchemas , authRootMutation} = require('./auth.schema')
const {userSchemas , userRootMutation} = require('./user.schema')
const {transactionSchemas, transactionRootQuery, transactionRootMutation} = require('./transaction.schema')

const paginationInput = `input PaginationInput {
    limit: Int
    page: Int
  }`

const rootQuery = `type RootQuery {
    ${itemRootQuery}
    ${transactionRootQuery}
}`

const rootMutation = `type RootMutation {
    ${authRootMutation}
    ${itemRootMutation}
    ${userRootMutation}
    ${transactionRootMutation}
}`

module.exports = buildSchema(`

${authSchemas}
${itemSchemas}
${userSchemas}
${transactionSchemas}
${paginationInput}
${rootQuery}
${rootMutation}
schema {
  query: RootQuery
  mutation: RootMutation
}
`)