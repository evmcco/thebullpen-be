//take 'raw' holdings from database
//filter out any without ticker or cost_basis
//get quotes
//calc profit
//only return data points the UI needs

const { getQuotes } = require("./getQuotes")
const { calculateProfit } = require("./calculateProfit")

const processDerivativeHoldings = async (derivatives) => {
  const filteredDerivativeHoldings = filterHoldings(derivatives)
  const parsedDerivativeHoldings = parseDerivativeTickers(filteredDerivativeHoldings)
  const derivativeHoldingsWithQuotes = await getQuotes(parsedDerivativeHoldings)
  const trimmedDerivativeHoldings = trimHoldings(derivativeHoldingsWithQuotes)
  return trimmedDerivativeHoldings
}

const trimHoldings = (holdings) => {
  return holdings.map((holding) => {
    const trimmedHolding = {}
    trimmedHolding.ticker_symbol = holding.parsedTicker[1]
    trimmedHolding.longshort = holding.quantity > 0 ? "Long" : holding.quantity < 0 ? "Short" : null
    trimmedHolding.putcall = holding.parsedTicker[6] === "C" ? "Call" : holding.parsedTicker[6] === "P" ? "Put" : null
    trimmedHolding.expirationDate = `20${holding.parsedTicker[3]}-${holding.parsedTicker[4]}-${holding.parsedTicker[5]}`
    trimmedHolding.strikePrice = (Number(holding.parsedTicker[7]) / 1000).toFixed(2)
    trimmedHolding.tickerChange = !!holding.quote ? (Number(holding.quote.changePercent) * 100).toFixed(2) : null
    trimmedHolding.type = holding.type
    return trimmedHolding
  })
}

const filterHoldings = (holdings) => {
  return holdings.filter(holding =>
    (!!holding.cost_basis && !!holding.ticker_symbol))
}

const parseDerivativeTickers = (holdings) => {
  holdings.forEach((holding) => {
    if (holding.type === 'derivative') {
      const regEx = /([\w]+)((\d{2})(\d{2})(\d{2}))([PC])(\d{8})/g;
      holding.parsedTicker = regEx.exec(holding.ticker_symbol)
    }
  })
  return holdings
}

const getTotalPortfolioValue = (h) => {
  const reducer = (accumulator, currentValue) => {
    if (currentValue.ticker_symbol == 'CUR:USD') {
      return Number(accumulator) + Number(currentValue.quantity)
    }
    if (currentValue.type === 'derivative') {
      return Number(accumulator)
    }
    const holdingPrice = !!currentValue.quote?.latestPrice ? currentValue.quote.latestPrice : Number(currentValue.close_price)
    const totalHoldingValue = holdingPrice * Number(currentValue.quantity)
    return Number(accumulator) + totalHoldingValue
  }
  return h.reduce(reducer, 0).toFixed(2)
}

module.exports = { processDerivativeHoldings }