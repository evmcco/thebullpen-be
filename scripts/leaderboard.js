const performanceModel = require("../models/performance")
const bullpensModel = require("../models/bullpens")
const { calculateDailyPerformance } = require("../controllers/calculateDailyPerformance")

const leaderboard = async () => {
  const allUsers = await bullpensModel.getAllBullpens()
  allUsers.forEach(async (user) => {
    const userPerformance = await calculateDailyPerformance(user.username)
    performanceModel.saveTickerPerformance(user.username, userPerformance)
  })
}

leaderboard()

