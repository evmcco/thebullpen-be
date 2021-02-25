const express = require("express");
const router = express.Router();
const holdingsModel = require("../models/holdings");

const { getHoldingsQuoteData } = require("../controllers/getHoldingsQuoteData")

router.get("/user/:username", async (req, res, next) => {
  const userHoldings = await holdingsModel.getHoldingsByUser(req.params.username);
  //take tickers from userHoldings, hit IEX with each of them, add IEX data to each holdings object, then send to FE
  const userHoldingsWithQuotes = await getHoldingsQuoteData(userHoldings)
  res.json(userHoldingsWithQuotes).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await holdingsModel.saveHoldings(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;