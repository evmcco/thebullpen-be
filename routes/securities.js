const express = require("express");
const router = express.Router();
const securitiesModel = require("../models/securities");

router.post("/save", async (req, res, next) => {
  const saveResponse = await securitiesModel.saveSecurities(req.body.username);
  res.json(saveResponse).status(200);
})

module.exports = router;