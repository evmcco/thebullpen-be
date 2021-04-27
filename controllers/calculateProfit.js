const calculateProfit = (holdings) => {
  holdings.forEach((holding) => {
    try {
      const averageCost = holding.cost_basis / holding.quantity
      const price = !!holding.quote?.latestPrice ? holding.quote.latestPrice : holding.close_price
      holding.profit = (((price - averageCost) / averageCost) * 100).toFixed(2)
      return { ...holding }
    } catch (err) {
      return { ...holding }
    }
  })
  return holdings
}

module.exports = { calculateProfit }