'use strict';

const express = require('express');
require('dotenv').config();
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('./public')); //go look in a folder called public for anything CSS related
// app.get('/', (req, res) => {res.render('./pages/index.ejs')});
app.get('/', (req, res) => { res.render('./pages/searches/new'); });

app.post('/new_search', (req, res) => {
  console.log('this is from searches', req.body);
});

app.post('/getBooks', getBook);//call the getBook

function getBook(req, res) {
//   const book = req.query.body;
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (req.body.authorIs) {
    url+=`inauthor:${req.body.name}`;
  } else if (req.body.titleIs){
    url+=`intitle:${req.body.name}`;
  }
  console.log(url);

  superagent.get(url)
    .then(returnedData => {
      const arr = returnedData.body.items.map(bookOutput);
      function bookOutput(info) {
        return new Book(info);
      }
      res.render('pages/searches/show.ejs', {arr});
    })
    .catch(error => {
      console.log(error);
      res.render('/pages/error.ejs');
    });
}
function Book(returnedData) {
  this.image_url = returnedData.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = returnedData.volumeInfo.title;
  this.author = returnedData.volumeInfo.authors[0] || 'Error, no author found';
  this.description = returnedData.volumeInfo.description;
}

app.listen(PORT, () => console.log(`up on http://localhost:${PORT}`));
