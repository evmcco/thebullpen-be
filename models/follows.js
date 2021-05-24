const db = require("./conn.js");
const moment = require('moment');

class Follows {
  static async addFollow(followerUsername, followeeUsername) {
    //add a single follow instance
    const datetime = moment().format()
    try {
      const response = await db.none('insert into follows (follower_username, followee_username, date_added) values (($1), ($2), ($3))', [followerUsername, followeeUsername, datetime])
      return response
    } catch (err) {
      return err.message
    }
  }

  static async removeFollow(followId) {
    //remove a single follow instance by follow ID
    try {
      const response = await db.none('delete from follows where follow_id = ($1)', [followId])
      return response
    } catch (err) {
      return err.message
    }
  }

  static async getAllUserFollows(username) {
    //get all follows for a username
    try {
      const response = await db.any('select * from follows where follower_username = ($1) order by date_added desc', [username])
      return response
    } catch (err) {
      return err.message
    }
  }
  static async getAllUserFollowers(username) {
    //get all followers for a username
    try {
      const response = await db.any('select * from follows where followee_username = ($1) order by date_added desc', [username])
      return response
    } catch (err) {
      return err.message
    }
  }
}

module.exports = Follows;
