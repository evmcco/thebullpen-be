const express = require("express");
const router = express.Router();
const groupsModel = require("../models/models");

router.post("/create", async (req, res, next) => {
  const response = groupsModel.createGroup(req.body.name, req.body.description, req.body.imageLink = '')
  res.json(response).status(200)
})

router.post("/join", async (req, res, next) => {
  const response = groupsModel.addUserToGroup(req.body.username, req.body.groupId)
  res.json(response).status(200)
})

router.post("/leave", async (req, res, next) => {
  const response = groupsModel.removeUserFromGroup(req.body.username, req.body.groupId)
  res.json(response).status(200)
})

router.get("/all", async (req, res, next) => {
  const response = groupsModel.getAllGroups()
  res.json(response).status(200)
})

router.get("/members/:groupId", async (req, res, next) => {
  const response = groupsModel.getGroupMembers(req.params.groupId)
  res.json(response).status(200)
})

router.get("/user/all/:username", async (req, res, next) => {
  const response = groupsModel.getUserGroups(req.params.username)
  res.json(response).status(200)
})

module.exports = router;