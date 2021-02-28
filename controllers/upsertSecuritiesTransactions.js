const upsertSecuritiesTransactions = async (username, plaidResponse) => {
  const securitiesModel = require("../models/securities");
  const transactionsModel = require("../models/transactions");

  const transactionsUpsertResponse = await transactionsModel.upsertTransactions(username, plaidResponse.investment_transactions)

  const securitiesUpsertResponse = await securitiesModel.upsertSecurities(plaidResponse.securities);

  return { transactionsUpsertResponse, securitiesUpsertResponse }
}

module.exports = { upsertSecuritiesTransactions }