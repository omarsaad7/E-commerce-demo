const { buildSchema } = require('graphql');
const {itemSchemas , itemRootQuery, itemRootMutation} = require('./item.schema')
const {authSchemas , authRootMutation} = require('./auth.schema')
const {userSchemas , userRootMutation} = require('./user.schema')


const paginationInput = `input PaginationInput {
    limit: Int
    page: Int
  }`

const rootQuery = `type RootQuery {
    ${itemRootQuery}
}`

const rootMutation = `type RootMutation {
    ${authRootMutation}
    ${itemRootMutation}
}`

module.exports = buildSchema(`

${authSchemas}
${itemSchemas}
${paginationInput}
${rootQuery}
${rootMutation}
schema {
  query: RootQuery
  mutation: RootMutation
}
`)