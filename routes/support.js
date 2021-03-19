const express = require("express");
const router = express.Router();
const usersModel = require("../models/users")

const { requestHoldings } = require("../controllers/requestHoldings")
const { requestTransactions } = require("../controllers/requestTransactions")

router.post("/holdings/refresh/all", async (req, res, next) => {
  const userTokens = await usersModel.getAllUsersAccessTokens()
  const response = userTokens.map(async (userTokenObj) => {
    const requestHoldingsResponse = await requestHoldings(userTokenObj.access_token, userTokenObj.item_id, userTokenObj.username)
    console.log(requestHoldingsResponse)
    return { ...userTokenObj, requestHoldingsResponse }
  })
  res.json(userTokens).status(200);
});

router.post("/transactions/refresh/all", async (req, res, next) => {
  const userTokens = await usersModel.getAllUsersAccessTokens()
  const response = userTokens.map(async (userTokenObj) => {
    const requestTransactionResponse = await requestTransactions(userTokenObj.access_token, userTokenObj.username)
    console.log(requestTransactionResponse)
    return { ...userTokenObj, requestTransactionResponse }
  })
  res.json(userTokens).status(200);
});


module.exports = router;