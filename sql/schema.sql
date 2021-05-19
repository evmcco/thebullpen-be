--usernames(deprecated)
create table usernames
(
  username VARCHAR(100) primary key
);

--plaid_access_tokens
create table plaid_access_tokens
(
  username VARCHAR(100),
  access_token VARCHAR(100),
  item_id VARCHAR(100)
);

--securities
create table securities
(
  id serial primary key,
  security_id VARCHAR(50) unique not null,
  isin VARCHAR(12),
  cusip VARCHAR(9),
  sedol VARCHAR(7),
  institution_security_id VARCHAR(50),
  institution_id VARCHAR(50),
  proxy_security_id VARCHAR(50),
  name VARCHAR(150),
  ticker_symbol VARCHAR(150),
  is_cash_equivalent boolean not null,
  type VARCHAR(100) not null,
  close_price numeric,
  close_price_as_of VARCHAR(150),
  iso_currency_code VARCHAR(10),
  unofficial_currency_code VARCHAR(50)
);

--holdings
create table holdings
(
  id serial primary key,
  username VARCHAR(50) not null,
  account_id VARCHAR(50) not null,
  security_id VARCHAR(50) not null,
  institution_price numeric not null,
  institution_price_as_of VARCHAR(50),
  institution_value numeric not null,
  cost_basis numeric,
  quantity numeric not null,
  iso_currency_code VARCHAR(10),
  unofficial_currency_code VARCHAR(50)
);

--webhooks
create table plaid_webhooks
(
  id serial primary key,
  webhook_json jsonb,
  date_sent timestamp
)

--transactions
create table investment_transactions
(
  investment_transaction_id VARCHAR(150) primary key,
  username VARCHAR(50) not null,
  cancel_transaction_id VARCHAR(150),
  account_id VARCHAR(150) not null,
  security_id VARCHAR(150),
  date timestamp,
  name VARCHAR(150) not null,
  quantity numeric not null,
  amount numeric not null,
  price numeric not null,
  fees numeric,
  type VARCHAR(150) not null,
  subtype VARCHAR(150) not null,
  iso_currency_code VARCHAR(10),
  unofficial_currency_code VARCHAR(50)
)

--plaid item-level data
create table plaid_items
(
  item_id varchar(50) primary key,
  username VARCHAR(50),
  institution_id varchar(50),
  webhook varchar(50),
  error text,
  available_products text,
  billed_products text,
  consent_expiration_time varchar(50),
)

--plaid account-level data
create table plaid_accounts
(
  account_id varchar(150) primary key,
  username VARCHAR(50),
  balances text,
  mask varchar(4),
  name varchar(150),
  official_name varchar(150),
  type varchar(100),
  subtype varchar(100),
  verification_status varchar(100)
)

create table performance
(
  id serial primary key,
  username VARCHAR(50) not null,
  performance numeric not null,
  date timestamp not null
)

create table zabo_accounts
(
  username VARCHAR(50) not null,
  user_id VARCHAR(40) not null,
  account_id VARCHAR(40) not null,
  provider_name VARCHAR(100) not null,
  provider_logo VARCHAR(200)
)

create table zabo_balances
(
  id serial primary key,
  username VARCHAR(50) not null,
  account_id VARCHAR(40) not null,
  balance_json jsonb
)

create table zabo_transactions
(
  id VARCHAR(200) primary key,
  username VARCHAR(50) not null,
  account_id VARCHAR(40) not null,
  transaction_json jsonb
)