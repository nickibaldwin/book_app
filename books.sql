DROP TABLE IF EXISTS bookapp;

CREATE TABLE bookapp (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255),
    title VARCHAR(255),
    author VARCHAR(255),
    description VARCHAR(255)
)