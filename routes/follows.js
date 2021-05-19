const express = require("express");
const router = express.Router();
const {
  addFollow,
  removeFollow,
  getAllUserFollows,
  getAllUserFollowers
} = require("../controllers/follows");

router.post("/add-follow", async (req, res, next) => {
  const follower = req.body.followerUsername
  const followee = req.body.followeeUsername
  const addedFollow = await addFollow(follower, followee)
  console.log(addedFollow)
  res.json(addedFollow)
})

router.delete("/remove-follow", async (req, res, next) => {
  const followerId = req.body.followId
  const removedFollow = await removeFollow(followerId)
  console.log(removedFollow)
  res.json(removedFollow)
})

router.get("/user-follows", async (req, res, next) => {
  const username = req.body.username
  const follows = await getAllUserFollows(username)
  console.log('follows', follows)
  res.json(follows)
})

router.get("/user-followers", async (req, res, next) => {
  const username = req.body.username
  const followers = await getAllUserFollowers(username)
  console.log('followers', followers)
  res.json(followers)
})

module.exports = router
