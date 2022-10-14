const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
const dotenv = require("dotenv")
const uri = require('./config/uri.json')
const constants = require('./config/constants.json')

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
app.use(
  express.urlencoded({
    extended: false
  })
);
// Cors
app.use(cors());

// Entry point
app.get("/", (req, res) => res.send({msg:constants.welcomeMsg}));
// Use Routes
app.use(uri.user.baseUri, require("./api/routes/user.router"));
app.use(uri.transaction.baseUri, require("./api/routes/transaction.router"));
app.use(uri.item.baseUri, require("./api/routes/item.router"));
app.use(uri.order.baseUri, require("./api/routes/order.router"));
app.use(uri.auth.baseUri, require("./api/routes/auth.router"));
// Wrong path
app.use((req, res) =>
  res.status(404).send({error:constants.errorMessages.invalidUrl})
);


// Port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));