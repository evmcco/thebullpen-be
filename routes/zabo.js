const express = require("express");
const router = express.Router();
require('dotenv').config()
const Zabo = require('zabo-sdk-js');
const { getUserByItemId } = require("../models/users");

const zaboModel = require("../models/zabo");
const zaboBalancesModel = require("../models/zaboBalances")
const zaboTransactionsModel = require("../models/zaboTransactions")

const initZabo = async () => {
  const zaboClient = await Zabo.init({
    apiKey: process.env.ZABO_LIVE_API_KEY,
    secretKey: process.env.ZABO_LIVE_SECRET_API_KEY,
    env: 'live'
  })
  return zaboClient
}


router.get('/', async function (req, res, next) {
  const zabo = await initZabo()
  let myTeam = await zabo.getTeam()
  console.log(myTeam)
});

async function getAllZaboTransactions(params, zaboClient) {
  //call the transactions endpoint until theres a response, then get the entire history
  const transactions = []

  let page
  while (true) {
    const resp = await (page ? page.next() : zaboClient.transactions.getList(params))

    const list = resp.data || []
    const delay = resp.delay * 1000 // ms
    const lastUpdatedAt = resp.last_updated_at

    if (delay && !lastUpdatedAt) {
      await new Promise(res => setTimeout(res, delay))
    } else {
      transactions.push(...list)
      if (!resp.hasMore) break
      page = resp
    }
  }

  return transactions
}

router.post('/save_account_id', async function (req, res, next) {
  const zabo = await initZabo()
  //check DB to see if user has a zabo connection and user_id already, if so add the account to the existing user instead
  const zaboUserId = await zaboModel.getZaboUserId(req.body.username)
  if (!!zaboUserId) {
    var zaboUser = await zabo.users.getOne(zaboUserId)
    try {
      await zabo.users.addAccount(zaboUser, req.body.account)
    } catch (e) {
      console.log(e.message)
      return e.message
    }
  } else {
    //if Bullpen user doesn't have a Zabo connection yet, create a new user
    var zaboUser = await zabo.users.create(req.body.account)
  }
  const userId = zaboUser.id
  const accountId = req.body.account.id
  //save account to the database DO I NEED TO DO THIS?
  await zaboModel.saveAccount(req.body.username, userId, accountId, req.body.account.provider.name, req.body.account.provider.logo)
  //get the account balances
  const balsResponse = await zabo.users.getBalances({
    userId,
    accountId
  })
  //delete balances for the account (just in case)
  const balancesDeleteResponse = await zaboBalancesModel.deleteBalancesForAccount(accountId)
  //save the account balances
  const balsSaveResponse = await zaboBalancesModel.saveBalances(req.body.username, accountId, balsResponse.data)
  //get the transactions
  const txnsResponse = await getAllZaboTransactions({
    userId,
    accountId,
  }, zabo)
  //save the transactions
  const txnsUpsertResponse = await zaboTransactionsModel.upsertTransactions(req.body.username, accountId, txnsResponse)
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
  try {
    await zabo.users.removeAccount({ userId: req.params.user_id, accountId: req.params.account_id })
    await zaboModel.deleteZaboAccount(req.params.account_id)
    res.json(response).status(200)
  } catch {
    res.sendStatus(400)
  }
})

router.post('/webhook', async function (request, response, next) {
  //TODO handle incoming webhooks https://zabo.com/docs/#transaction-and-balance-updates
  const webhookSaveResponse = await webhooksModel.saveWebhook(request.body)
  if (req.body.event === "transactions.update") {
    const accountId = req.body.data.account_id
    const username = await zaboModel.getUsernameFromAccountId(accountId)
    //delete balances for the account 
    const balancesDeleteResponse = await zaboBalancesModel.deleteBalancesForAccount(accountId)
    //save the new balances to the account
    const balsSaveResponse = await zaboBalancesModel.saveBalances(username, accountId, req.body.data.balances)
    //save transactions for the account
    const txnsSaveResponse = await zaboTransactionsModel.upsertTransactions(username, accountId, req.body.data.transactions)
  }
})


module.exports = router;