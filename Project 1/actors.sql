-- 1.
CREATE TABLE Actors(name varchar(40), movie varchar(80), year integer, role varchar(40));

-- 2.
LOAD DATA LOCAL INFILE './actors.csv' INTO TABLE Actors 
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"';

-- 3.
SELECT name
FROM Actors
WHERE movie = 'Die Another Day';

-- 4.
DROP TABLE Actors;