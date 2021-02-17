const express = require("express");
const router = express.Router();
const usersModel = require("../models/users");

require('dotenv').config()

var ManagementClient = require('auth0').ManagementClient;
var auth0 = new ManagementClient({
  domain: 'thebullpen.us.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_SECRET,
  scope: 'read:users update:users update:users_app_metadata'
});

router.post("/username/save", async (req, res, next) => {
  const response = await usersModel.saveUsername(req.body.username);
  res.json(response).status(200);
});

router.get("/username/exists/:username", async (req, res, next) => {
  const usernameExists = await usersModel.doesUsernameExist(req.params.username);
  res.json(usernameExists).status(200);
});

router.post("/update_user_metadata", async (req, res, next) => {
  console.log("USER METADATA BODY", req.body)
  const params = { id: req.body.userId }
  const metadata = {}
  if (!!req.body.plaid_access_token) {
    metadata.plaid_access_token = req.body.plaid_access_token
  }
  if (!!req.body.username) {
    metadata.username = req.body.username
  }
  //TODO save username to usernames table in DB
  if (Object.entries(metadata).length === 0) {
    res.json({ message: "no username or access_token submitted" }).status(400)
  }
  auth0.updateUserMetadata(params, metadata, function (err, user) {
    if (err) {
      res.json(err).status(400)
    }
    res.json(user).status(200)
  })
});

module.exports = router;