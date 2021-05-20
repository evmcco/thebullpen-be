const express = require("express");
const router = express.Router();
const {
  addFollow,
  removeFollow,
  getAllUserFollows,
  getAllUserFollowers
} = require("../controllers/follows");

router.post("/add_follow", async (req, res, next) => {
  const follower = req.body.followerUsername
  const followee = req.body.followeeUsername
  const addedFollow = await addFollow(follower, followee)
  console.log(addedFollow)
  res.json(addedFollow)
})

router.delete("/remove_follow", async (req, res, next) => {
  const followerId = req.body.followId
  const removedFollow = await removeFollow(followerId)
  console.log(removedFollow)
  res.json(removedFollow)
})

router.post("/user_follows", async (req, res, next) => {
  const username = req.body.username
  const follows = await getAllUserFollows(username)
  console.log('follows', follows)
  res.json(follows)
})

router.post("/user_followers", async (req, res, next) => {
  const username = req.body.username
  const followers = await getAllUserFollowers(username)
  console.log('followers', followers)
  res.json(followers)
})

module.exports = router
