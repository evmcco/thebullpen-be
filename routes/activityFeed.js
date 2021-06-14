const express = require("express");
const router = express.Router();
const ActivityFeedModel = require("../models/activityFeed");

router.post("/get_user_activity_feed", async (req, res, next) => {
  let username = req.body.username
  const response = await ActivityFeedModel.getUserActivityFeed(username);

  res.json(response).status(200);
});


module.exports = router;
