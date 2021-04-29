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
}

module.exports = Performance;
