const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const uri = require('../../config/uri.json')
const {Login}=authController

  router.post(uri.auth.api.login,Login)
  
  module.exports = router;
