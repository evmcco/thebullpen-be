insert into users
  (id, username)
values
  (1, 'evmcco'),
  (2, 'kawnr'),
  (3, 'degenerate_jack'),
  (4, 'sherstock_holmes'),
  (5, 'DMorey'),
  (6, 'ChetBlazer');

insert into securities
  (security_id, name, ticker_symbol)
values
  ('a', 'Apple', 'AAPL'),
  ('b', 'Tesla', 'TSLA'),
  ('c', 'ARK Web ETF', 'ARKW'),
  ('d', 'Gamestop', 'GME'),
  ('e', 'AMC Entertainment Holdings', 'AMC'),
  ('f', 'NIO EV CN CO', 'NIO');

insert into holdings
  (id, user_id, security_id, institution_price, institution_value, cost_basis, quantity)
VALUES
  (1, 1, 'a', 165.42, 1654.20, 162.11, 10),
  (2, 1, 'c', 171.33, 342.66, 168.43, 2),
  (3, 1, 'f', 51.29, 153.75, 53.77, 3),
  (4, 2, 'd', 63.20, 63.20, 233.75, 1),
  (5, 3, 'b', 743.32, 14863.42, 723.54, 20),
  (6, 4, 'e', 7.134523, 14.39834573, 8.34753475, 2.34573);

