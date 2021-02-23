const db = require("./conn.js");
const moment = require('moment');


class Webhooks {
  static async saveWebhook(webhook) {
    const datetime = moment().format()
    try {
      const response = await db.any('insert into webhooks (plaid_webhook, date_sent) values ($1, $2)', webhook, datetime);
      return response;
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Webhooks;