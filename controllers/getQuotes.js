const fetch = require('node-fetch');
const memoize = require('memoized-keyv');

const getQuotes = async (holdings) => {
  const memoizedQuoteRequest = memoize(getQuote, { store: quoteMap }, { ttl: (resp) => resp.statusCode === 200 ? 300000 : 0 })
  const holdingsWithQuotes = await Promise.all(holdings.map(async (holding) => {
    //fetch IEX quote endpoint for ticker
    const requestTicker = holding.type !== 'derivative' ? holding.ticker_symbol : holding.parsedTicker[1]
    try {
      const quote = await memoizedQuoteRequest(requestTicker)
      holding.quote = quote
      return holding
    } catch (err) {
      return holding
    }
  }))
  return holdingsWithQuotes
}

const getQuote = async (ticker) => {
  console.log(`FETCHING ${ticker}`)
  const response = await fetch(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${process.env.IEX_CLOUD_TOKEN}`)
  const quote = await response.json()
  quote.statusCode = response.status
  return quote
}

module.exports = { getQuotes }