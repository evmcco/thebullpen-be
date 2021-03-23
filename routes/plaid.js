const express = require("express");
const router = express.Router();
require('dotenv').config()

const moment = require('moment');
const util = require('util');
const plaid = require('plaid');

const webhooksModel = require("../models/webhooks")

const { getUserByItemId } = require("../models/users");
const { requestHoldings } = require("../controllers/requestHoldings")
const { requestTransactions } = require("../controllers/requestTransactions")

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
    webhook: 'https://api.thebullpen.app/plaid/webhook',
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

router.post('/request/holdings', async function (request, response, next) {
  const requestHoldingsResponse = await requestHoldings(request.body.plaid_access_token, request.body.item_id, request.body.username)
  response.status(200).json(requestHoldingsResponse)
});

router.post('/request/transactions', async function (request, response, next) {
  const requestTransactionsResponse = await requestTransactions(request.body.plaid_access_token, request.body.username)
  response.status(200).json(requestTransactionsResponse)
});

router.post('/webhook', async function (request, response, next) {
  const saveResponse = await webhooksModel.saveWebhook(request.body)
  if (request.body.webhook_type == 'HOLDINGS' && request.body.webhook_code == 'DEFAULT_UPDATE') {
    const userData = await getUserByItemId(request.body.item_id)
    const requestResponse = await requestHoldings(userData.access_token, request.body.item_id, userData.username)
  }
  else if (request.body.webhook_type == 'INVESTMENTS_TRANSACTIONS' && request.body.webhook_code == 'DEFAULT_UPDATE') {
    const userData = await getUserByItemId(request.body.item_id)
    const requestResponse = await requestTransactions(userData.access_token, userData.username)
  }
  if (saveResponse == true) {
    response.sendStatus(200)
  }
})

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