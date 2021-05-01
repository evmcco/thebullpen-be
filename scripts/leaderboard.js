const moment = require('moment');

const performanceModel = require("../models/performance")
const bullpensModel = require("../models/bullpens")
const { calculateDailyPerformance } = require("../controllers/calculateDailyPerformance")

const leaderboard = async () => {
  const dayOfWeek = moment().day()
  if (dayOfWeek === 6 || dayOfWeek === 7) {
    console.log("skipping leaderboard calculation, its the weekend")
  } else {
    const allUsers = await bullpensModel.getAllBullpens()
    allUsers.forEach(async (user) => {
      const userPerformance = await calculateDailyPerformance(user.username)
      performanceModel.saveTickerPerformance(user.username, userPerformance)
    })
  }
}

leaderboard()

