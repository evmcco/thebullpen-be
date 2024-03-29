//take 'raw' holdings from database
//filter out any without ticker or cost_basis
//get quotes
//calc profit
//only return data points the UI needs

const { getQuotes } = require("./getQuotes")
const { calculateProfit } = require("./calculateProfit")

const processHoldings = async (holdings) => {
  const filteredHoldings = filterHoldings(holdings)
  const holdingsWithQuotes = await getQuotes(filteredHoldings)
  const holdingsWithQuotesAndProfit = calculateProfit(holdingsWithQuotes)
  const totalPortfolioValue = getTotalPortfolioValue(holdingsWithQuotesAndProfit)
  const trimmedHoldings = trimHoldings(holdingsWithQuotesAndProfit, totalPortfolioValue)
  return trimmedHoldings
}

const trimHoldings = (holdings, totalPortfolioValue) => {
  return holdings.map((holding) => {
    const trimmedHolding = {}
    trimmedHolding.ticker_symbol = removeCur(holding.ticker_symbol)
    trimmedHolding.change = !!holding.quote ? (Number(holding.quote.changePercent) * 100).toFixed(2) : null
    trimmedHolding.currentPrice = !!holding.quote?.latestPrice ? Number(holding.quote.latestPrice).toFixed(2) : holding.close_price
    trimmedHolding.averageCost = !!holding.quantity ? (Number(holding.cost_basis) / Number(holding.quantity)).toFixed(3) : null
    trimmedHolding.profit = !!holding.profit ? `${holding.profit}%` : null
    trimmedHolding.weight = (((Number(holding.quantity) * trimmedHolding.currentPrice) / totalPortfolioValue) * 100).toFixed(2) + '%'
    trimmedHolding.type = holding.type
    return trimmedHolding
  })
}

const filterHoldings = (holdings) => {
  return holdings.filter(holding =>
    (!!holding.cost_basis && !!holding.ticker_symbol))
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

const removeCur = (ticker) => {
  if (ticker.startsWith('CUR:')) {
    return ticker.substring(4)
  } else {
    return ticker
  }
}

module.exports = { processHoldings }