const express = require("express");
const router = express.Router();
const holdingsModel = require("../models/holdings");

const { getHoldingsQuoteData } = require("../controllers/getHoldingsQuoteData")
const { processDerivatives } = require("../controllers/processDerivatives")

router.get("/user/:username", async (req, res, next) => {
  const userHoldings = await holdingsModel.getHoldingsByUser(req.params.username);
  const derivatives = userHoldings.filter((holding) => {
    return holding.type == 'derivative'
  })
  console.log("DERIVATIVES", derivatives)
  const equities = userHoldings.filter((holding => {
    return holding.type != 'derivative'
  }))
  console.log("EQUITIES", equities)
  //take tickers from userHoldings, hit IEX with each of them, add IEX data to each holdings object, then send to FE
  const userEquitiesHoldingsWithQuotes = await getHoldingsQuoteData(equities)
  const parsedDerivativesWithQuotes = await processDerivatives(derivatives)
  res.json({ userEquitiesHoldingsWithQuotes, parsedDerivativesWithQuotes }).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await holdingsModel.saveHoldings(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;