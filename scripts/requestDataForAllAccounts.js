require('dotenv').config()

const moment = require('moment');
const plaid = require('plaid');
const usersModel = require('../models/users')

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const PLAID_SECRET = (PLAID_ENV == 'sandbox' ? process.env.PLAID_SECRET_SANDBOX : process.env.PLAID_SECRET_DEVELOPMENT)

const client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments[PLAID_ENV],
  options: {
    version: '2019-05-29',
  },
});

//pull all [access_token, username] combinations, and hit the /request/holdings and /request/transactions endpoints for them
const getSavePlaidHoldings = async (access_token, username) => {
  client.getHoldings(access_token, async function (error, holdingsResponse) {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    const { upsertSecuritiesDeleteSaveHoldings } = require("../controllers/upsertSecuritiesDeleteSaveHoldings");
    const response = await upsertSecuritiesDeleteSaveHoldings(username, holdingsResponse)
    return response
  })
}

const getSavePlaidTransactions = async (access_token, username) => {
  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  client.getInvestmentTransactions(
    access_token,
    startDate,
    endDate,
    async function (error, investmentTransactionsResponse) {
      if (error != null) {
        prettyPrintResponse(error);
        return response.json({
          error,
        });
      }
      const { upsertSecuritiesTransactions } = require("../controllers/upsertSecuritiesTransactions")
      const response = await upsertSecuritiesTransactions(username, investmentTransactionsResponse)
      return response
    },
  );
}

const requestDataForAllAccounts = async () => {
  const allUsersAccessTokens = await usersModel.getAllUsersAccessTokens()
  //TODO figure out how to cleanly run the code to get/save holdings and txns data
  allUsersAccessTokens.forEach((userAccessToken) => {
    const holdingsSaveResponse = await getSavePlaidHoldings(userAccessToken.plaid_access_token, userAccessToken.username)
    const transactionsSaveResponse = await getSavePlaidTransactions(userAccessToken.plaid_access_token, userAccessToken.username)
  })
}