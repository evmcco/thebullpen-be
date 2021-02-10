const express = require("express");
const router = express.Router();
const holdingsModel = require("../models/holdings");

router.get("/user/:userId", async (req, res, next) => {
  const userHoldings = await holdingsModel.getHoldingsByUser(req.params.userId);
  res.json(userHoldings).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await holdingsModel.saveHoldings(Number(req.body.userId));
  res.json(saveResponse).status(200);
})

module.exports = router;