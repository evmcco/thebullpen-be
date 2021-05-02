const moment = require('moment');

const performanceModel = require("../models/performance")
const bullpensModel = require("../models/bullpens")
const { calculateDailyPerformance } = require("../controllers/calculateDailyPerformance")

const leaderboard = async () => {
  const dayOfWeek = moment().day()
  console.log(`day of week: ${dayOfWeek}`)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    console.log("skipping leaderboard calculation, its the weekend")
  } else {
    console.log("weekday detected, running calculation")
    const allUsers = await bullpensModel.getAllBullpens()
    allUsers.forEach(async (user) => {
      const userPerformance = await calculateDailyPerformance(user.username)
      console.log(`saving performance for ${user.username}: ${userPerformance}`)
      performanceModel.saveTickerPerformance(user.username, userPerformance)
    })
  }
}

leaderboard()

