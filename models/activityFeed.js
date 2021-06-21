const db = require("./conn.js");
const moment = require('moment');

class ActivityFeed {
  static async addPlaidTransactions(transactions) {
    let sortedTransactions = transactions.sort((a, b)=>
      new Date(a.date) - new Date(b.date)
    )
    const datetime = moment().format()
    await db.tx(t => {
      try {
      const queries = sortedTransactions.map(trans => {
        let text = `On ${moment(trans.date).format('ddd MMM Do YYYY')} ${trans.username} ${trans.subtype === 'buy' ? 'bought': 'sold'} ${trans.ticker ? trans.ticker : trans.ticker_symbol} at $${Number(trans.price).toFixed(2)}`
        return t.none('INSERT INTO activity_feed (date, username, activity_type, activity, investment_transaction_id) VALUES(($1), ($2), ($3), ($4), ($5)) on conflict (investment_transaction_id) do nothing',
        [datetime, trans.username, 'transaction', `{"date": "${trans.date}", "asset": "${trans.ticker ? trans.ticker : trans.ticker_symbol}", "type": "${trans.subtype}", "price": "${trans.price}", "text": "${text}", "ticker": "${trans.ticker_symbol}"}`, trans.investment_transaction_id])
      })
      return t.batch(queries)
    } catch (err){
      console.log("ERROR", err)
      return(err)
    }
    })
    .then(data => {
      return data
    })
    .catch(err => {
      console.log("catch error:", err)
      return (err)
    })
  }

  static async getUserActivityFeed(username, lastActivityId) {
    let limit = 10
    try {
      let {max} = await db.one("SELECT max(id) from activity_feed")
      lastActivityId = lastActivityId > 0 ? lastActivityId - 1 : max
      // const response = await db.any("WITH user_follows AS (SELECT follow_id, follower_username, followee_username FROM follows where follower_username = ($1)) SELECT * from activity_feed a join user_follows f on a.username = f.followee_username WHERE a.id > ($4) order by a.activity -> to_char(date, 'YYYY-MM-DD') desc LIMIT ($3)", [username, offset, limit, lastActivityId]);
      const response = await db.any("WITH user_follows AS (SELECT follow_id, follower_username, followee_username FROM follows where follower_username = ($1)) SELECT * from activity_feed a join user_follows f on a.username = f.followee_username WHERE a.id <= ($3) order by a.id desc LIMIT ($2)", [username, limit, lastActivityId]);

      return response;
    } catch (err) {
      console.log('error: ', err)
      return err.message;
    }
  }
}

module.exports = ActivityFeed;
