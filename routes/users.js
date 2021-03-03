const express = require("express");
const router = express.Router();
const usersModel = require("../models/users");

router.post("/username/save", async (req, res, next) => {
  const response = await usersModel.saveUsername(req.body.username);
  res.json(response).status(200);
});

router.get("/username/exists/:username", async (req, res, next) => {
  const usernameExists = await usersModel.doesUsernameExist(req.params.username);
  res.json(usernameExists).status(200);
});

router.get("/get_access_tokens/:username", async (req, res, next) => {
  const response = await usersModel.getAccessTokens(req.params.username);
  res.json(response).status(200);
})

router.get("/all/get_access_tokens", async (req, res, next) => {
  const response = await usersModel.getAllUsersAccessTokens();
  res.json(response).status(200);
})

router.post("/save_access_token", async (req, res, next) => {
  const response = await usersModel.saveAccessToken(req.body);
  res.json(response).status(200);
})

module.exports = router;