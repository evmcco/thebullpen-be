const express = require("express");
const router = express.Router();
const performanceModel = require("../models/performance")
const bullpensModel = require("../models/bullpens")

const { calculateDailyPerformance } = require("../controllers/calculateDailyPerformance")

router.get("/daily/:username", async (req, res, next) => {
  const response = await calculateDailyPerformance(req.params.username)
  res.json(response).status(200)
})

router.get("/calculate/today/all", async (req, res, next) => {
  const allUsers = await bullpensModel.getAllBullpens()
  allUsers.forEach(async (user) => {
    const userPerformance = await calculateDailyPerformance(user.username)
    performanceModel.saveTickerPerformance(user.username, userPerformance)
  })
  res.sendStatus(200)
})

module.exports = router;