const followsModel = require("../models/follows")

const addFollow = async (followerUsername, followeeUsername) => {
  const result = await followsModel.addFollow(followerUsername, followeeUsername)
  console.log(result)
  return result
}
const removeFollow = async (followId) => {
  const result = await followsModel.removeFollow(followId)
  console.log(result)
  return result
}

const getAllUserFollows = async (username) => {
  const userFollows = await followsModel.getAllUserFollows(username)
  return userFollows
}
const getAllUserFollowers = async (username) => {
  const userFollowers = await followsModel.getAllUserFollowers(username)
  console.log(userFollowers)
  return userFollowers
}


module.exports = {
  addFollow,
  removeFollow,
  getAllUserFollows,
  getAllUserFollowers
}
