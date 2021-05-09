const express = require("express");
const router = express.Router();
require('dotenv').config()
const Zabo = require('zabo-sdk-js')

const zaboModel = require("../models/zabo");

const initZabo = async () => {
  const zaboClient = await Zabo.init({
    apiKey: process.env.ZABO_SANDBOX_API_KEY,
    secretKey: process.env.ZABO_SANDBOX_SECRET_API_KEY,
    env: 'sandbox'
  })
  return zaboClient
}


router.get('/', async function (req, res, next) {
  const zabo = await initZabo()
  let myTeam = await zabo.getTeam()
  console.log(myTeam)
});

router.post('/save_account_id', async function (req, res, next) {
  const zabo = await initZabo()
  // console.log("REQ.BODY", req.body)
  //TODO check DB to see if user has a zabo connection and user_id already, if so add the account to the existing user instead
  //create user
  const newUser = await zabo.users.create(req.body.account)
  //from new user, save user_id and account_id to database, with username
  // console.log("NEW USER", newUser)
  const userId = newUser.id
  const accountId = newUser.accounts[0].id
  //get the account balance
  const balsResponse = await zabo.users.getBalances({
    userId,
    accountId
  })
  console.log("BALANCES", balsResponse)
  //get the transactions
  const txnsResponse = await zabo.transactions.getList({
    userId,
    accountId,
    limit: 10
  })
  //TODO if last_updated_at is 0, wait for half a second and call again
  console.log("TRANSACTIONS", txnsResponse)
});

module.exports = router;