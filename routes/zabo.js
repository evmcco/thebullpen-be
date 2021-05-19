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
    var zaboUser = await zabo.users.getOne(zaboUserId)
    console.log("zaboUser", zaboUser)
    try {
      await zabo.users.addAccount(zaboUser, req.body.account)
    } catch (e) {
      console.log(e.message)
      return e.message
    }
  } else {
    //if Bullpen user doesn't have a Zabo connection yet, create a new user
    const zaboUser = await zabo.users.create(req.body.account)
  }
  const userId = zaboUser.id
  const accountId = req.body.account.id
  //save account DO I NEED TO DO THIS?
  await zaboModel.saveAccount(req.body.username, userId, accountId, req.body.account.provider.name, req.body.account.provider.logo)
  //get the account balances
  const balsResponse = await zabo.users.getBalances({
    userId,
    accountId
  })
  //save the account balances
  const balsSaveResponse = await zaboBalancesModel.saveBalances(req.body.username, accountId, balsResponse.data)
  //get the transactions
  const txnsResponse = await zabo.transactions.getList({
    userId,
    accountId,
    limit: 5
  })
  console.log(txnsResponse)
  //TODO if last_updated_at is 0, wait for half a second and call again
  //save the transactions
  const txnsSaveResponse = await zaboTransactionsModel.saveTransactions(req.body.username, accountId, txnsResponse.data)
});

router.get('/user/accounts/:username', async function (req, res, next) {
  const zabo = await initZabo()
  try {
    const zaboUserId = await zaboModel.getZaboUserId(req.params.username)
    const zaboUser = await zabo.users.getOne(zaboUserId)
    const userAccounts = zaboUser.accounts
    res.json({ user_id: zaboUserId, accounts: userAccounts }).status(200)
  } catch {
    res.sendStatus(400)
  }
})

router.delete('/user/:user_id/accounts/:account_id', async function (req, res, next) {
  const zabo = await initZabo()
  console.log(req.params)
  try {
    const response = await zabo.users.removeAccount({ userId: req.params.user_id, accountId: req.params.account_id })
    console.log(response)
    res.json(response).status(200)
  } catch {
    res.sendStatus(400)
  }
})

router.post('/webhook', async function (request, response, next) {
  //TODO handle incoming webhooks https://zabo.com/docs/#transaction-and-balance-updates
})

module.exports = router;