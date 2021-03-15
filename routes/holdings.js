const express = require("express");
const router = express.Router();
const holdingsModel = require("../models/holdings");

const { getHoldingsQuoteData } = require("../controllers/getHoldingsQuoteData")
const { processDerivatives } = require("../controllers/processDerivatives")
const { calculateProfit } = require("../controllers/calculateProfit")

router.get("/user/:username", async (req, res, next) => {
  const userHoldings = await holdingsModel.getHoldingsByUser(req.params.username);
  const derivatives = userHoldings.filter((holding) => {
    return holding.type == 'derivative'
  })
  const equities = userHoldings.filter((holding => {
    return holding.type != 'derivative'
  }))
  //take tickers from userHoldings, hit IEX with each of them, add IEX data to each holdings object, then send to FE
  const userEquitiesHoldingsWithQuotes = await getHoldingsQuoteData(equities)
  const equitiesWithQuotesAndProfit = await calculateProfit(userEquitiesHoldingsWithQuotes)
  const parsedDerivativesWithQuotes = await processDerivatives(derivatives)
  res.json([...equitiesWithQuotesAndProfit, ...parsedDerivativesWithQuotes]).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await holdingsModel.saveHoldings(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;