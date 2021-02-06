const express = require("express");
const router = express.Router();
const usersModel = require("../models/users");

router.get("/all", async (req, res, next) => {
  const allAccounts = await usersModel.getAllUsers();
  res.json(allAccounts).status(200);
});

module.exports = router;