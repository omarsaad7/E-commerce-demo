
const userCreationSchema = `type CreateUser {
    name: String
    token: String
    userId: ID
  }`

const createCustomerInput = `input CreateCustomerInput {
    username: String!
    password: String!
  }`

const userRootMutation = `
    createCustomer(createCustomerInput: CreateCustomerInput!): CreateUser
`
const userSchemas =  `
${userCreationSchema}
${createCustomerInput}
`
module.exports = {
  userSchemas,
  userRootMutation
}