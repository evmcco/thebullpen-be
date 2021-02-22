const express = require("express");
const router = express.Router();
const bullpensModel = require("../models/bullpens");

router.get("/trending", async (req, res, next) => {
  const response = await bullpensModel.getAllBullpens();
  res.json(response).status(200);
});


module.exports = router;