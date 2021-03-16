const upsertSecuritiesDeleteSaveHoldings = async (item_id, username, plaidResponse) => {
  const securitiesModel = require("../models/securities");
  const holdingsModel = require("../models/holdings");

  const holdingsDeleteResponse = await holdingsModel.deleteHoldings(item_id)
  const holdingsSaveResponse = await holdingsModel.saveHoldings(item_id, username, plaidResponse.holdings);

  const securitiesUpsertResponse = await securitiesModel.upsertSecurities(plaidResponse.securities);

  return { holdingsDeleteResponse, holdingsSaveResponse, securitiesUpsertResponse }
}

module.exports = { upsertSecuritiesDeleteSaveHoldings }