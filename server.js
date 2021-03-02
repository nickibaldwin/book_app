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
  console.log(req.body);
  const url = 'https://www.googleapis.com/books/v1/volumes?q=inauthor=frank';

  superagent.get(url)
    .then(returnedData => {
      const arr = returnedData.body.items.map(bookOutput);
      function bookOutput(info) {
        return new Book(info);
      }
      console.log(res);
      res.send(arr); //res.render(pages/searches/show.ejs, {arr})
    })
    .catch(error => {
      res.status(500).send('Ooops, I broke it again', error);
    });
}
function Book() {
//   this.image_url = returnedData.volumeInfo.imageLinks.thumbnail | 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = '';
  this.author = '';
  this.description = '';
}

app.listen(PORT, () => console.log(`up on http://localhost:${PORT}`));
