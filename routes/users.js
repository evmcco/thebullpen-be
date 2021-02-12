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

router.get("/all", async (req, res, next) => {
  const allAccounts = await usersModel.getAllUsers();
  res.json(allAccounts).status(200);
});

// router.get("/setupData", async (req, res, next) => {
//   const response = await usersModel.getUserSetupData(req.body.auth0UserId)
//   res.json(response).status(200);
// })

// router.post("/save_auth0_user_id", async (req, res, next) => {
//   const response = await usersModel.saveAuth0UserId(req.body.userId)
//   res.json(response).status(200);
// })

router.post("/update_user_metadata", async (req, res, next) => {
  const params = { id: req.body.userId }
  const metadata = {}
  if (!!req.body.plaid_access_token) {
    metadata.plaid_access_token = req.body.plaid_access_token
  }
  if (!!req.body.username) {
    metadata.username = req.body.username
  }
  console.log(metadata)
  auth0.updateUserMetadata(params, metadata, function (err, user) {
    if (err) {
      res.json(err).status(200)
    }
    res.json(user).status(200)
  })
});

module.exports = router;