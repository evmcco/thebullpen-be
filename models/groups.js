const db = require("./conn.js");
const moment = require('moment');

class Groups {
  static async createGroup(name, description, imageLink) {
    //create a group
    try {
      const response = await db.none('insert into groups (name, description, image_link) values (($1), ($2), ($3))', [name, description, imageLink])
      return response
    } catch (err) {
      return err.message
    }
  }

  static async addUserToGroup(username, groupId) {
    //add a user to a group
    const datetime = moment().format()
    try {
      const response = await db.none('insert into groups_users (username, group_id, joined_date) values (($1), ($2), ($3))', [username, groupId, datetime])
      return response
    } catch (err) {
      return err.message
    }
  }

  static async removeUserFromGroup(username, groupId) {
    //remove a user from a group
    try {
      const response = await db.none('delete from groups_users where username = ($1) and group_id = ($2)', [username, groupId])
      return response
    } catch (err) {
      return err.message
    }
  }

  static async isUserInGroup(username, groupId) {
    //remove a user from a group
    try {
      const response = await db.one('select exists (select 1 from groups_users where username = ($1) and group_id = ($2))', [username, groupId])
      return response
    } catch (err) {
      return err.message
    }
  }

  static async getAllGroups() {
    //get all groups
    try {
      const response = await db.any('select g.*, count(*) as members from groups g join groups_users gu on g.id = gu.group_id group by g.id')
      return response
    } catch (err) {
      return err.message
    }
  }

  static async getGroupDetails(groupId) {
    //get the details of a single group
    try {
      const response = await db.any('select * from groups where id = ($1)', groupId)
      return response
    } catch (err) {
      return err.message
    }
  }

  static async getGroupMembers(groupId) {
    //get the member roster of a group
    try {
      const response = await db.any('select * from groups_users where group_id = ($1) order by joined_date asc', groupId)
      return response
    } catch (err) {
      return err.message
    }
  }

  static async getUserGroups(username) {
    //get all of a user's groups
    try {
      const response = await db.any('select g.name, g.id from groups_users gu join groups g on gu.group_id = g.id where username = ($1) order by joined_date asc', username)
      return response
    } catch (err) {
      return err.message
    }
  }
}

module.exports = Groups;