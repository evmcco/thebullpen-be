const express = require("express");
const router = express.Router();
const transactionsModel = require("../models/transactions");
const { getHoldingsQuoteData } = require("../controllers/getHoldingsQuoteData")


router.get("/user/:username", async (req, res, next) => {
  const userTransactions = await transactionsModel.getTransactionsByUser(req.params.username);
  const userTransactionsWithQuotes = await getHoldingsQuoteData(userTransactions)
  res.json(userTransactionsWithQuotes).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await transactionsModel.saveTransactions(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;