insert into usernames
  (username)
values
  ('evmcco'),
  ('vchang'),
  ('philleotardo'),
  ('aulebron');

insert into securities
  (username, security_id, name, ticker_symbol, is_cash_equivalent, type)
values
  ('evmcco', 'a', 'Apple', 'AAPL', false, 'equity'),
  ('evmcco', 'b', 'Tesla', 'TSLA', false, 'equity'),
  ('evmcco', 'c', 'ARK Web ETF', 'ARKW', false, 'equity'),
  ('aulebron', 'd', 'Gamestop', 'GME', false, 'equity'),
  ('vchang', 'e', 'AMC Entertainment Holdings', 'AMC', false, 'equity'),
  ('philleotardo', 'f', 'NIO EV CN CO', 'NIO', false, 'equity');

insert into holdings
  (username, security_id, institution_price, institution_value, cost_basis, quantity, account_id)
VALUES
  ('evmcco', 'a', 165.42, 1654.20, 162.11, 10, 'a'),
  ('evmcco', 'b', 171.33, 342.66, 168.43, 2, 'a'),
  ('evmcco', 'c', 51.29, 153.75, 53.77, 3, 'a'),
  ('aulebron', 'd', 63.20, 63.20, 233.75, 1, 'b'),
  ('vchang', 'e', 743.32, 14863.42, 723.54, 20, 'c'),
  ('philleotardo', 'f', 7.134523, 14.39834573, 8.34753475, 2.34573, 'd');

