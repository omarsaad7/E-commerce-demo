
const itemSchema = `type Item {
    _id: ID!
    name: String!
    description: String
    img: String
    quantity: Int!
    price: Int!
    createdAt:String
    updatedAt:String
  }`

const allItemsSchema = `type Items {
    totalSize: Int!
    limit: Int!
    page: Int!
    data:[Item!]!
  }`
const itemInput = `input ItemInput {
    name: String!
    description: String
    img: String
    quantity: Int!
    price: Int!
  }`

const itemRootQuery = `
    items(paginationInput: PaginationInput):Items!
    item(id:ID!):Item!
`

const itemRootMutation = `
    createItem(itemInput: ItemInput): Item
`
const itemSchemas =  `
${itemSchema}
${itemInput}
${allItemsSchema}
`
module.exports = {
  itemSchemas,
  itemRootQuery,
  itemRootMutation
}