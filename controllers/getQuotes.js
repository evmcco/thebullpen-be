const fetch = require('node-fetch');
const memoize = require('memoized-keyv');

const getQuotes = async (holdings) => {
  const memoizedQuoteRequest = memoize(getQuote, { store: quoteMap }, { ttl: (resp) => resp.statusCode === 200 ? 300000 : 0 })
  const holdingsWithQuotes = await Promise.all(holdings.map(async (holding) => {
    //fetch IEX quote endpoint for ticker
    try {
      if (!!holding.unofficial_currency_code) {
        const requestTicker = `${holding.unofficial_currency_code}USDT`
        const quote = await memoizedQuoteRequest(requestTicker, true)
        holding.quote = quote
        return holding
      }
      //https://cloud.iexapis.com/stable/crypto/${ticker}/quote
      else {
        const requestTicker = holding.type !== 'derivative' ? holding.ticker_symbol : holding.parsedTicker[1]
        const quote = await memoizedQuoteRequest(requestTicker, false)
        holding.quote = quote
        return holding
      }
    } catch (err) {
      return holding
    }
  }))
  return holdingsWithQuotes
}

const getQuote = async (ticker, isCrypto) => {
  //I think this is where the try...catch should be, not up top
  if (!isCrypto) {
    const response = await fetch(`https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${process.env.IEX_CLOUD_TOKEN}`)
    //https://cloud.iexapis.com/stable/crypto/${ticker}/quote

    const quote = await response.json()
    quote.statusCode = response.status
    return quote
  } else if (isCrypto) {
    const response = await fetch(`https://cloud.iexapis.com/stable/crypto/${ticker}/quote?token=${process.env.IEX_CLOUD_TOKEN}`)
    const quote = await response.json()
    quote.statusCode = response.status
    return quote
  }
}

module.exports = { getQuotes }