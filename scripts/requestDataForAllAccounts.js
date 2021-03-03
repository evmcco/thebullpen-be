//pull all [access_token, username] combinations, and hit the /request/holdings and /request/transactions endpoints for them

const requestDataForAllAccounts = async () => {
  const fetch = require('node-fetch');
  const usersModel = require('../models/users')
  const allUsersAccessTokens = await usersModel.getAllUsersAccessTokens()
  //TODO figure out how to cleanly run the code to get/save holdings and txns data
}