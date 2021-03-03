const upsertSecuritiesDeleteSaveHoldings = async (username, plaidResponse) => {
  const securitiesModel = require("../models/securities");
  const holdingsModel = require("../models/holdings");

  const holdingsDeleteResponse = await holdingsModel.deleteHoldings(username)
  const holdingsSaveResponse = await holdingsModel.saveHoldings(username, plaidResponse.holdings);

  const securitiesUpsertResponse = await securitiesModel.upsertSecurities(plaidResponse.securities);

  return { holdingsDeleteResponse, holdingsSaveResponse, securitiesUpsertResponse }
}

module.exports = { upsertSecuritiesDeleteSaveHoldings }