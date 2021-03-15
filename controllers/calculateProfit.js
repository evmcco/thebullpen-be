const calculateProfit = (holdings) => {
  holdings.forEach((holding) => {
    try {
      const averageCost = holding.cost_basis / holding.quantity
      holding.profit = (((holding.quote.latestPrice - averageCost) / averageCost) * 100).toFixed(2)
      return { ...holding }
    } catch (err) {
      return { ...holding }
    }
  })
  return holdings
}

module.exports = { calculateProfit }