const express = require("express");
const router = express.Router();
const groupsModel = require("../models/groups");

router.post("/create", async (req, res, next) => {
  const response = await groupsModel.createGroup(req.body.name, req.body.description, req.body.imageLink = '')
  res.json(response).status(200)
})

router.post("/join", async (req, res, next) => {
  const response = await groupsModel.addUserToGroup(req.body.username, req.body.groupId)
  res.json(response).status(200)
})

router.post("/leave", async (req, res, next) => {
  const response = await groupsModel.removeUserFromGroup(req.body.username, req.body.groupId)
  res.json(response).status(200)
})

router.get("/memberof/:username/:groupId", async (req, res, next) => {
  const response = await groupsModel.isUserInGroup(req.params.username, req.params.groupId)
  res.json(response).status(200)
})

router.get("/all", async (req, res, next) => {
  const response = await groupsModel.getAllGroups()
  res.json(response).status(200)
})

router.get("/details/:groupId", async (req, res, next) => {
  const response = await groupsModel.getGroupDetails(req.params.groupId)
  res.json(response).status(200)
})

router.get("/members/:groupId", async (req, res, next) => {
  const response = await groupsModel.getGroupMembers(req.params.groupId)
  res.json(response).status(200)
})

router.get("/user/all/:username", async (req, res, next) => {
  const response = await groupsModel.getUserGroups(req.params.username)
  res.json(response).status(200)
})

module.exports = router;