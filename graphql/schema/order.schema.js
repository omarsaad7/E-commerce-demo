const orderItemSchema = `type OrderItem {
  item:Item
  count:Int
}`

const orderSchema = `type Order {
    _id: ID
    status: String
    totalPrice: Int
    userId:ID
    items:[OrderItem]
    receiptUrl:String
    transactionId:String
    createdAt:String
    updatedAt:String
  }`

const allOrdersSchema = `type Orders {
    totalSize: Int
    limit: Int
    page: Int
    data:[Order]
  }`


const orderRootQuery = `
    orders(paginationInput: PaginationInput,allUsers:Boolean,status:String):Orders
    order(id:ID!):Order!
`

const orderRootMutation = `
    createOrder: Order
    processToPaymentOrder(orderId:ID!): String
    deleteOrder(id:ID!): String
`
const orderSchemas =  `
${orderItemSchema}
${orderSchema}
${allOrdersSchema}
`
module.exports = {
  orderSchemas,
  orderRootQuery,
  orderRootMutation
}