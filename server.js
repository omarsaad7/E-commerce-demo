const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { graphqlHTTP } =require('express-graphql');
// const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const dotenv = require("dotenv")
const uri = require('./config/uri.json')
const constants = require('./config/constants.json')
const Item = require('./models/item.model.js')
const graphQLSchema = require('./graphql/schema/index.js');
const graphQlResolvers = require('./graphql/resolvers/index.js');
const verifyToken = require('./api/controllers/verifyToken.controller');

dotenv.config()

// Connect to Mongo
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));
// Express body parser
app.use(express.json());
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
// Cors
app.use(cors());
app.use(verifyToken);

// Entry point
app.get("/", (req, res) => res.send({msg:constants.welcomeMsg.msg}));
// Use Routes
app.use(uri.user.baseUri, require("./api/routes/user.router"));
app.use(uri.transaction.baseUri, require("./api/routes/transaction.router"));
app.use(uri.item.baseUri, require("./api/routes/item.router"));
app.use(uri.order.baseUri, require("./api/routes/order.router"));
app.use(uri.auth.baseUri, require("./api/routes/auth.router"));


app.use('/graphql' , graphqlHTTP({
  schema: graphQLSchema,
  rootValue: graphQlResolvers,
  graphiql:true,
  customFormatErrorFn(err) {
    if(!err.originalError) {
    return err;
    }
    // const data = err.originalError.data;
    const message = err.message || constants.errorMessages.errorOccured.msg;
    const code = err.originalError.statusCode || constants.errorMessages.errorOccured.statusCode;
    return { message: message, status: code };
    }
}))
// Wrong path
app.use((req, res) =>
  res.status(constants.errorMessages.invalidUrl.statusCode).send({error:constants.errorMessages.invalidUrl.msg})
);


// Port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));