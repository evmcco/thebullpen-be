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
  console.log(allUsers)
  allUsers.forEach(async (user) => {
    const userHoldingsWithPerformance = await calculateDailyPerformance(user.username)
    userHoldingsWithPerformance.forEach((data) => {
      performanceModel.saveTickerPerformance(data)
    })
  })
  res.json(response).status(200)
})

module.exports = router;