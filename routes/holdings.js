const express = require("express");
const router = express.Router();

const holdingsModel = require("../models/holdings");

const { getQuotes } = require("../controllers/getQuotes")
const { calculateProfit } = require("../controllers/calculateProfit")
const { processHoldings } = require("../controllers/processHoldings")

router.get("/user/:username", async (req, res, next) => {
  const userHoldings = await holdingsModel.getHoldingsByUser(req.params.username);
  userHoldings.forEach((holding) => {
    if (holding.type === 'derivative') {
      const regEx = /([\w]+)((\d{2})(\d{2})(\d{2}))([PC])(\d{8})/g;
      holding.parsedTicker = regEx.exec(holding.ticker_symbol)
    }
  })
  //take tickers from userHoldings, hit IEX with each of them, add IEX data to each holdings object, then send to FE
  // const holdingWithQuotes = await getQuotes(userHoldings)
  // const holdingWithQuotesAndProfit = await calculateProfit(holdingWithQuotes)
  const processedHoldings = await processHoldings(userHoldings)
  res.json(processedHoldings).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await holdingsModel.saveHoldings(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;