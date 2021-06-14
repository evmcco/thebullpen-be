const ActivityFeedModel = require("../models/activityFeed");
const TransactionsModel = require("../models/transactions");

const addPlaidTransactions = async () => {
  const transactions = await TransactionsModel.getAllTransactions()
  transactions.forEach((transaction) => {
    if (transaction.type === 'derivative') {
      const regEx = /([\w]+)((\d{2})(\d{2})(\d{2}))([PC])(\d{8})/g;
      transaction.parsedTicker = regEx.exec(transaction.ticker_symbol)
      transaction.ticker = transaction.parsedTicker[1]
    }
  })
  await ActivityFeedModel.addPlaidTransactions(transactions);
}

module.exports = {
  addPlaidTransactions
}
