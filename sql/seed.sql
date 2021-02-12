insert into users
  (auth0userid, username)
values
  ('auth0|1jsdfhkjsy823hiuafh', 'evmcco'),
  ('auth0|2jhasdfkjhasiauf489', 'dirkdiggler');

insert into securities
  (username, security_id, name, ticker_symbol)
values
  ('evmcco', 'a', 'Apple', 'AAPL'),
  ('evmcco', 'b', 'Tesla', 'TSLA'),
  ('evmcco', 'c', 'ARK Web ETF', 'ARKW'),
  ('evmcco', 'd', 'Gamestop', 'GME'),
  ('vchang', 'e', 'AMC Entertainment Holdings', 'AMC'),
  ('PhilLeotardo', 'f', 'NIO EV CN CO', 'NIO');

insert into holdings
  (username, security_id, institution_price, institution_value, cost_basis, quantity)
VALUES
  ('evmcco', 'a', 165.42, 1654.20, 162.11, 10),
  ('evmcco', 'c', 171.33, 342.66, 168.43, 2),
  ('evmcco', 'f', 51.29, 153.75, 53.77, 3),
  ('evmcco', 'd', 63.20, 63.20, 233.75, 1),
  ('vchang', 'b', 743.32, 14863.42, 723.54, 20),
  ('PhilLeotardo', 'e', 7.134523, 14.39834573, 8.34753475, 2.34573);

