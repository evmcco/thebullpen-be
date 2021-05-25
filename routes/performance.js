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

router.get("/leaderboard/today", async (req, res, next) => {
  const response = await performanceModel.getTodaysLeaderboard()
  res.json(response).status(200)
})

router.get("/today/:username", async (req, res, next) => {
  let username = req.params.username
  const dailyPerformance = await performanceModel.getUserDailyPerformance(username)
  res.json(dailyPerformance).status(200)
})

module.exports = router;
