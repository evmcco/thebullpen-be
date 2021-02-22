const db = require("./conn.js");

class Bullpens {
  static async getAllBullpens() {
    try {
      const response = await db.any('select distinct username from plaid_access_tokens');
      return response;
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Bullpens;