const db = require("./conn.js");
const moment = require('moment');

class Performance {
  static async saveTickerPerformance(username, performance) {
    const date = moment().format('YYYY-MM-DD')
    try {
      const response = await db.none('insert into performance (username, performance, date) values (($1), ($2), ($3)) on conflict (username, date) do update set performance = ($2)', [username, Number(performance), date])
      return true
    } catch (err) {
      return err.message
    }
  }

  static async getTodaysLeaderboard() {
    try {
      const response = await db.any("select p.* from performance p where date = (select max(date) from performance p1 where p1.username = p.username) order by performance desc")
      return response
    } catch (err) {
      return err.message
    }
  }
  static async getUserDailyPerformance(username) {
    try {
      const response = await db.one("select DISTINCT * from performance where date = (select max(date) from performance) AND username = ($1)", [username])
      return response
    } catch (err) {
      return err.message
    }
  }
}

module.exports = Performance;
