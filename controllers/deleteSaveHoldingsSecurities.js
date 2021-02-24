const deleteSaveHoldingsSecurites = async (username, plaidResponse) => {
  const securitiesModel = require("../models/securities");
  const holdingsModel = require("../models/holdings");

  const holdingsDeleteResponse = await holdingsModel.deleteHoldings(username)
  const securitiesDeleteResponse = await securitiesModel.deleteSecurities(username)

  const holdingsSaveResponse = await holdingsModel.saveHoldings(username, plaidResponse.holdings);
  const securitiesSaveResponse = await securitiesModel.saveSecurities(username, plaidResponse.securities);

  return { holdingsDeleteResponse, securitiesDeleteResponse, holdingsSaveResponse, securitiesSaveResponse }
}

module.exports = { deleteSaveHoldingsSecurites }