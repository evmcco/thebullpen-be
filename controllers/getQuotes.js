const fetch = require('node-fetch');
const memoize = require('memoized-keyv');

const getQuotesOld = async (holdings) => {
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
      //wait 10 ms then try again, then wait 20 ms then try again
      return holding
    }
  }))
  return holdingsWithQuotes
}

const getQuotes = async (holdings) => {
  //TODO make this work if the user has >100 holdings, need to loop it
  //pull array of tickers from holdings
  const tickers = holdings.map((holding) => {
    if (!!holding.unofficial_currency_code) {
      return `${holding.unofficial_currency_code}USDT`
    } else if (holding.ticker_symbol === "CUR:BTC") {
      return "BTCUSDT"
    } else if (holding.type === "derivative") {
      return holding.parsedTicker[1]
    } else {
      return holding.ticker_symbol
    }
  })
  const uniqueTickers = [...new Set(tickers)]
  //turn array into comma separated string
  const tickerString = uniqueTickers.toString()
  //plug into url like https://cloud.iexapis.com/stable/stock/market/batch?symbols=BTCUSDT,AAPL,FB,ARKW&types=quote&token=pk_e633719ef3e74b81914e51099c7b012d
  const url = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${tickerString}&types=quote&token=${process.env.IEX_CLOUD_TOKEN}`
  // console.log(url)
  const response = await fetch(url)
  const quotes = await response.json()
  //loop through holdings, adding quote object to holding object if tickers match
  holdings.forEach((holding) => {
    let ticker = holding.ticker_symbol
    if (holding.type === "derivative") {
      ticker = holding.parsedTicker[1]
    } else if (!!holding.unofficial_currency_code) {
      ticker = `${holding.unofficial_currency_code}USDT`
    } else if (holding.ticker_symbol === "CUR:BTC") {
      ticker = "BTCUSDT"
    }
    try {
      holding.quote = quotes[ticker].quote
    } catch {
      holding.quote = null
    }
  })
  return holdings
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