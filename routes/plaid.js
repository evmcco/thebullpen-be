const express = require("express");
const router = express.Router();
require('dotenv').config()

const moment = require('moment');
const util = require('util');
const plaid = require('plaid');

const securitiesModel = require("../models/securities");
const holdingsModel = require("../models/holdings");


const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const PLAID_SECRET = (PLAID_ENV == 'sandbox' ? process.env.PLAID_SECRET_SANDBOX : process.env.PLAID_SECRET_DEVELOPMENT)
const PLAID_PRODUCTS = process.env.PLAID_PRODUCTS.split(
  ',',
);
const PLAID_COUNTRY_CODES = process.env.PLAID_COUNTRY_CODES.split(
  ',',
);
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI

let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;

const client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments[PLAID_ENV],
  options: {
    version: '2019-05-29',
  },
});

router.post('/info', function (request, response, next) {
  response.json({
    item_id: ITEM_ID,
    access_token: ACCESS_TOKEN,
    products: PLAID_PRODUCTS,
  });
});

router.post('/create_link_token', function (request, response, next) {
  const configs = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: request.body.user_id || 'userid',
    },
    client_name: 'The Bullpen',
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: 'en',
  };

  client.createLinkToken(configs, function (error, createTokenResponse) {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error: error,
      });
    }
    response.json(createTokenResponse);
  });
});

router.post('/set_access_token', function (request, response, next) {
  PUBLIC_TOKEN = request.body.public_token;
  client.exchangePublicToken(PUBLIC_TOKEN, function (error, tokenResponse) {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    response.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    });
  });
});

router.get('/holdings', function (request, response, next) {
  client.getHoldings(ACCESS_TOKEN, function (error, holdingsResponse) {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    // prettyPrintResponse(holdingsResponse);
    response.json({ error: null, holdings: holdingsResponse });
  });
});

router.post('/request/holdings', function (request, response, next) {
  client.getHoldings(request.body.plaid_access_token, async function (error, holdingsResponse) {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    // prettyPrintResponse(holdingsResponse);
    // response.json({ error: null, holdings: holdingsResponse });
    console.log(holdingsResponse)
    //TODO send securities object to sec model and holdings object to hold model
    const holdingsSaveResponse = await holdingsModel.saveHoldings(request.body.username, holdingsResponse.holdings);
    const securitiesSaveResponse = await securitiesModel.saveSecurities(request.body.username, holdingsResponse.securities);
    response.json({ securitiesResponse: securitiesSaveResponse, holdingsResponse: holdingsSaveResponse }).status(200)
  });


});

router.get('/investment_transactions', function (request, response, next) {
  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  client.getInvestmentTransactions(
    ACCESS_TOKEN,
    startDate,
    endDate,
    function (error, investmentTransactionsResponse) {
      if (error != null) {
        prettyPrintResponse(error);
        return response.json({
          error,
        });
      }
      prettyPrintResponse(investmentTransactionsResponse);
      response.json({
        error: null,
        investment_transactions: investmentTransactionsResponse,
      });
    },
  );
});

router.get('/item', function (request, response, next) {
  // Pull the Item - this includes information about available products,
  // billed products, webhook information, and more.
  client.getItem(ACCESS_TOKEN, function (error, itemResponse) {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    // Also pull information about the institution
    client.getInstitutionById(
      itemResponse.item.institution_id,
      function (err, instRes) {
        if (err != null) {
          const msg =
            'Unable to pull institution information from the Plaid API.';
          console.log(msg + '\n' + JSON.stringify(error));
          return response.json({
            error: msg,
          });
        } else {
          prettyPrintResponse(itemResponse);
          response.json({
            item: itemResponse.item,
            institution: instRes.institution,
          });
        }
      },
    );
  });
});

const prettyPrintResponse = (response) => {
  console.log(util.inspect(response, { colors: true, depth: 4 }));
};

module.exports = router;