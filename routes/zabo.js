const express = require("express");
const router = express.Router();
require('dotenv').config()
const Zabo = require('zabo-sdk-js')

const zaboModel = require("../models/zabo");
const zaboBalancesModel = require("../models/zaboBalances")
const zaboTransactionsModel = require("../models/zaboTransactions")

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
  //check DB to see if user has a zabo connection and user_id already, if so add the account to the existing user instead
  const zaboUserId = await zaboModel.getZaboUserId(req.body.username)
  if (!!zaboUserId) {
    const zaboUser = await zabo.users.getOne(zaboUserId)
    console.log("zaboUser", zaboUser)
    try {
      await zabo.users.addAccount(zaboUser, req.body.account)
    } catch (e) {
      console.log(e)
      return e
    }
  } else {
    //if Bullpen user doesn't have a Zabo connection yet, create a new user
    const zaboUser = await zabo.users.create(req.body.account)
  }
  const userId = zaboUser.id
  const accountId = req.body.account.id
  //save account
  await zaboModel.saveAccount(req.body.username, userId, accountId, req.body.account.provider.name, req.body.account.provider.logo)
  //get the account balances
  const balsResponse = await zabo.users.getBalances({
    userId,
    accountId
  })
  //TODO save the account balances
  //get the transactions
  const txnsResponse = await zabo.transactions.getList({
    userId,
    accountId,
    limit: 1
  })
  //TODO if last_updated_at is 0, wait for half a second and call again
  //TODO save the transactions
});

router.post('/webhook', async function (request, response, next) {
  //TODO handle incoming webhooks https://zabo.com/docs/#transaction-and-balance-updates
})

module.exports = router;