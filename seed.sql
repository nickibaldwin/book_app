-- psql -f seed.sql -d bookapp

INSERT INTO bookapp (title, author, image_url, description) VALUES ('title', 'author', 'https://i.imgur.com/J5LVHEL.jpg', 'description');

INSERT INTO bookapp (title, author, image_url, description) VALUES (
  'Dune',
  'Frank Herbert',
  'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
  'Follows the adventures of Paul Atreides, the son of a betrayed duke given up for dead on a treacherous desert planet and adopted by its fierce, nomadic people, who help him unravel his most unexpected destiny.'
);

INSERT INTO bookapp (title, author, image_url, description) VALUES ('HP', 'JK Rowling', 'https://i.imgur.com/J5LVHEL.jpg', 'description');