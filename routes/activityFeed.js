const express = require("express");
const router = express.Router();
const ActivityFeedModel = require("../models/activityFeed");

router.get("/get_user_activity_feed", async (req, res, next) => {
  let username = req.query.username
  let lastActivityId = req.query.lastActivityId
  const response = await ActivityFeedModel.getUserActivityFeed(username, lastActivityId);

  res.json(response).status(200);
});


module.exports = router;
