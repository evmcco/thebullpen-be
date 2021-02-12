const express = require("express");
const router = express.Router();
const holdingsModel = require("../models/holdings");

router.get("/user/:username", async (req, res, next) => {
  const userHoldings = await holdingsModel.getHoldingsByUser(req.params.username);
  res.json(userHoldings).status(200);
});

router.post("/save", async (req, res, next) => {
  const saveResponse = await holdingsModel.saveHoldings(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;