const requestTransactions = async (access_token, username) => {
  const plaid = require('plaid');
  const moment = require('moment');
  const securitiesModel = require("../models/securities");
  const transactionsModel = require("../models/transactions");
  //init plaid client
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
  //pull txns
  const startDate = moment().subtract(90, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  client.getInvestmentTransactions(
    access_token,
    startDate,
    endDate,
    async function (error, investmentTransactionsResponse) {
      if (error != null) {
        return investmentTransactionsResponse.json({
          error,
        });
      }
      //upsert
      const transactionsUpsertResponse = await transactionsModel.upsertTransactions(username, investmentTransactionsResponse.investment_transactions)
      const securitiesUpsertResponse = await securitiesModel.upsertSecurities(investmentTransactionsResponse.securities);
      return { transactionsUpsertResponse, securitiesUpsertResponse }
    },
  );
}
module.exports = { requestTransactions }