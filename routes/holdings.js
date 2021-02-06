const express = require("express");
const router = express.Router();
const holdingsModel = require("../models/holdings");

router.get("/user/:userId", async (req, res, next) => {
  const userHoldings = await holdingsModel.getHoldingsByUser(req.params.userId);
  res.json(userHoldings).status(200);
});

module.exports = router;