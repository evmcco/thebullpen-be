const express = require("express");
const router = express.Router();
const transactionsModel = require("../models/transactions");

router.get("/user/:username", async (req, res, next) => {
  const userTransactions = await transactionsModel.getTransactionsByUser(req.params.username);
  res.json(userTransactions).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await transactionsModel.saveTransactions(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;