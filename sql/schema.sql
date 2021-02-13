--usernames
create table usernames
(
  username VARCHAR(100) primary key
)

--securities
create table securities
(
  security_id VARCHAR(50) primary key,
  username VARCHAR(50) not null,
  foreign key(username) references usernames(username),
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
)

--holdings
create table holdings
(
  id serial primary key,
  username VARCHAR(50) not null,
  foreign key(username) references usernames(username),
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

--transactions
create table investment_transactions
(
  investment_transaction_id VARCHAR(150) primary key,
  username VARCHAR(50),
  foreign key(username) references usernames(username),
  cancel_transaction_id VARCHAR(150),
  account_id VARCHAR(150),
  security_id VARCHAR(150),
  date VARCHAR(150),
  name VARCHAR(150),
  quantity numeric,
  amount numeric,
  price numeric,
  fees numeric,
  type VARCHAR(150),
  subtype VARCHAR(150),
  iso_currency_code VARCHAR(10),
  unofficial_currency_code VARCHAR(50),
  request_id VARCHAR(50)
)

--plaid item-level data
create table plaid_items
(
  item_id varchar(50) primary key,
  username VARCHAR(50),
  foreign key(username) references usernames(username),
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
  foreign key(username) references usernames(username),
  balances text,
  mask varchar(4),
  name varchar(150),
  official_name varchar(150),
  type varchar(100),
  subtype varchar(100),
  verification_status varchar(100)
)