const express = require("express");
const router = express.Router();
require('dotenv').config()

const zaboModel = require("../models/zabo");


router.get('/', function (request, response, next) {
  Zabo.init({
    apiKey: process.env.ZABO_SANDBOX_API_KEY,
    secretKey: process.env.ZABO_SANDBOX_SECRET_API_KEY,
    env: 'sandbox'
  }).then(async (zabo) => {
    let myTeam = await zabo.getTeam()
    console.log(myTeam)
  })
});

router.post('/save_account_id', function (request, response, next) {
  console.log(request.body)
});

module.exports = router;