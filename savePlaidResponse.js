const { Z_FIXED } = require("zlib");
const savePlaidResponseLogs = (plaidResponseObject, username, logType) => {
  const fs = require("fs");

  const logsString = JSON.stringify(plaidResponseObject);

  const time = Date.now();
  const timestamp = `${time}`;

  const dir = `/${__dirname}/plaidResponses/${username}`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  fs.writeFile(
    `${dir}/${timestamp}-${logType}.json`,
    logsString,
    "utf8",
    function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
      return { result: true, fileName: `${timestamp}${logType}.json` }
    }
  );
}

module.exports = { savePlaidResponseLogs }