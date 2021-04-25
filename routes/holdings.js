const express = require("express");
const router = express.Router();

const holdingsModel = require("../models/holdings");

const { getQuotes } = require("../controllers/getQuotes")
const { calculateProfit } = require("../controllers/calculateProfit")
const { processHoldings } = require("../controllers/processHoldings")
const { processDerivativeHoldings } = require("../controllers/processDerivativeHoldings")

router.get("/user/:username", async (req, res, next) => {
  const userHoldings = await holdingsModel.getHoldingsByUser(req.params.username);
  //take tickers from userHoldings, hit IEX with each of them, add IEX data to each holdings object, then send to FE
  // const holdingWithQuotes = await getQuotes(userHoldings)
  // const holdingWithQuotesAndProfit = await calculateProfit(holdingWithQuotes)
  const equities = userHoldings.filter((holding) => { return holding.type != "derivative" })
  const derivatives = userHoldings.filter((holding) => { return holding.type == "derivative" })
  const processedEquities = equities.length > 0 ? await processHoldings(equities) : null
  const processedDerivatives = derivatives.length > 0 ? await processDerivativeHoldings(derivatives) : null
  res.json({ equities: processedEquities, derivatives: processedDerivatives }).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await holdingsModel.saveHoldings(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;