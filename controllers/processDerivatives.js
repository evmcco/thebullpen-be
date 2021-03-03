const processDerivatives = async (derivatives) => {
  const fetch = require('node-fetch');
  //parse the derivative symbol
  derivatives.forEach(async (derivative) => {
    const regEx = /([\w]+)((\d{2})(\d{2})(\d{2}))([PC])(\d{8})/g;
    derivative.parsedTicker = regEx.exec(derivative.ticker_symbol)
  })
  //get quote data for the ticker for each derivative
  await Promise.all(derivatives.map(async (derivative) => {
    //fetch IEX quote endpoint for ticker
    try {
      const response = await fetch(`https://cloud.iexapis.com/stable/stock/${derivative.parsedTicker[1]}/quote?token=${process.env.IEX_CLOUD_TOKEN}`)
      const quote = await response.json()
      //add response to holding object
      derivative.quote = quote
    }
    catch (err) {
      console.log(err)
    }
  }))
  return derivatives
}

module.exports = { processDerivatives }