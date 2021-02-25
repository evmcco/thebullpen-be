const getHoldingsQuoteData = async (holdings) => {
  const fetch = require('node-fetch');
  const holdingsWithQuotes = await Promise.all(holdings.map(async (holding) => {
    //fetch IEX quote endpoint for ticker
    try {
      const response = await fetch(`https://cloud.iexapis.com/stable/stock/${holding.ticker_symbol}/quote?token=pk_e633719ef3e74b81914e51099c7b012d`)
      const quote = await response.json()
      //add response to holding object
      return { ...holding, quote }
    }
    catch (err) {
      return { ...holding }
    }
  }))
  return holdingsWithQuotes
}

module.exports = { getHoldingsQuoteData }