create table groups
(
  id serial primary key,
  name varchar(100) unique,
  description varchar(500),
  image_link varchar(500)
);

create table groups_users
(
  group_id int,
  username varchar(100),
  joined_date timestamp
);