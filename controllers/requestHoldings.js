const requestHoldings = async (access_token, item_id, username) => {
  const plaid = require('plaid');
  const securitiesModel = require("../models/securities");
  const holdingsModel = require("../models/holdings");
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
  //pull plaid holdings
  client.getHoldings(access_token, async function (error, holdingsResponse) {
    if (error != null) {
      return holdingsResponse.json({
        error,
      });
    }
    //upsert/delete/save
    const holdingsDeleteResponse = await holdingsModel.deleteHoldings(item_id)
    const holdingsSaveResponse = await holdingsModel.saveHoldings(item_id, username, holdingsResponse.holdings);
    const securitiesUpsertResponse = await securitiesModel.upsertSecurities(holdingsResponse.securities);
    return { holdingsDeleteResponse, holdingsSaveResponse, securitiesUpsertResponse }
  })
}

module.exports = { requestHoldings }

