const db = require("./conn.js");
const moment = require('moment');


class Webhooks {
  static async saveWebhook(webhook) {
    const datetime = moment().format()
    try {
      await db.none('insert into plaid_webhooks (webhook_json, date_sent) values ($1, $2)', [webhook, datetime]);
      return true;
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Webhooks;