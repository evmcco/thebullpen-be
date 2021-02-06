const db = require("./conn.js");

class Holdings {
  static async getHoldingsByUser(userId) {
    try {
      const response = await db.any(`select * from holdings h join securities s on h.security_id = s.security_id where user_id = ${userId}`);
      return response;
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = Holdings;