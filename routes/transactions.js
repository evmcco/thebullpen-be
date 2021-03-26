const express = require("express");
const router = express.Router();
const transactionsModel = require("../models/transactions");
const { getQuotes } = require("../controllers/getQuotes")


router.get("/user/:username", async (req, res, next) => {
  const userTransactions = await transactionsModel.getTransactionsByUser(req.params.username);
  userTransactions.forEach((transaction) => {
    if (transaction.type === 'derivative') {
      const regEx = /([\w]+)((\d{2})(\d{2})(\d{2}))([PC])(\d{8})/g;
      transaction.parsedTicker = regEx.exec(transaction.ticker_symbol)
    }
  })
  const userTransactionsWithQuotes = await getQuotes(userTransactions)
  res.json(userTransactionsWithQuotes).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await transactionsModel.saveTransactions(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;