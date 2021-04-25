const holdingsModel = require("../models/holdings");
const { getQuotes } = require("../controllers/getQuotes")


const calculateDailyPerformance = async (username) => {
  //get quantity and ticker for each EQUITY holding for a user, no derivs or cash or cryptos
  const holdings = await holdingsModel.getHoldingsByUser(username)
  //filter out cryptos and options
  const filteredHoldings = holdings.filter(holding =>
    (holding.type === "etf" || holding.type === "equity") && (!!holding.cost_basis && !!holding.ticker_symbol)
  )
  //get quote data for each ticker
  const holdingsWithQuotes = await getQuotes(filteredHoldings)

  //calculate total portfolio value for user, which is the sum of quantity * latestPrice for all holdings
  const totalPortfolioValue = getTotalPortfolioValue(holdingsWithQuotes)
  const holdingsWithPerformance = holdingsWithQuotes.map((holding) => {
    //calculate weight for each holding which is quantity * latestPrice / total portfolio value
    const price = !!holding.quote?.latestPrice ? holding.quote.latestPrice : Number(holding.close_price)
    const weight = ((Number(holding.quantity) * price) / totalPortfolioValue)
    //calculate performance which is the sum of weight * change for all holdings 
    return {
      username,
      ticker_symbol: holding.ticker_symbol,
      weight,
      change: holding.quote?.changePercent
    }
  })
  //save to the database
  return holdingsWithPerformance
}

const getTotalPortfolioValue = (holdings) => {
  const reducer = (accumulator, currentValue) => {
    const holdingPrice = !!currentValue.quote?.latestPrice ? currentValue.quote.latestPrice : Number(currentValue.close_price)
    const totalHoldingValue = holdingPrice * Number(currentValue.quantity)
    return Number(accumulator) + totalHoldingValue
  }
  return holdings.reduce(reducer, 0).toFixed(2)
}

module.exports = { calculateDailyPerformance }