'use strict';

//Environment Variables
require('dotenv').config();

//Application Dependencies 
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

//Application Setup
const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//Database Setup
const client = new pg.Client(DATABASE_URL);
client.on('error', err => console.error(err));

//Page Routes
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('./public')); //go look in a folder called public for anything CSS related
// app.get('/', (req, res) => {res.render('./pages/index.ejs')});
app.get('/', renderHome);
app.get('/books/:id', singleBook);

app.get('/new_search', newSearch);

app.post('/getBooks', getBook);//call the getBook
app.post('/books', addBook);

app.get('/add', showForm);
app.delete('/books/:id', deleteBook);

//Route Handlers

function deleteBook(req, res) {
  const id = req.params.id;
  const sqlStr = `DELETE FROM bookapp WHERE id=${id}`;
  client.query(sqlStr)
    .then(() => res.status(200).redirect('/'))
    .catch(err => handleError(err, res));
}

function showForm(req, res) {
  res.render('pages/index.ejs');
}

function handleError(error, res) {
  res.render('pages/error.ejs', {error: error});
}

function addBook(req,res){
  const sqlStr = 'INSERT INTO bookapp (title, author, image_url, description) VALUES ($1, $2, $3, $4) RETURNING id, title, author, image_url, description';
  const sqlArr = [req.body.title, req.body.author, req.body.image_url, req.body.description];
  client.query(sqlStr, sqlArr).then(results => {
    res.redirect('/books/' + results.rows[0].id);
  });
}

function renderHome(req, res){
  const sql = 'SELECT * FROM bookapp';
  client.query(sql).then(results => {
    res.render('./pages/index.ejs', {collection : results.rows});
  });
}

function newSearch(req, res) {
  res.render('./pages/searches/new.ejs');
}

function singleBook(req, res) {
  const sql = 'SELECT * FROM bookapp WHERE id=$1';
  const sqlValue = [req.params.id];
  client.query(sql, sqlValue).then(results => {
    res.render('./pages/books/detail.ejs', {book : results.rows[0]});
  });
}

function getBook(req, res) {
//   const book = req.query.body;
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  console.log(req.body);
  if (req.body.name[1] === 'author') {
    url+=`inauthor:${req.body.name[0]}`;
  } else if (req.body.name[1] === 'title'){
    url+=`intitle:${req.body.name[0]}`;
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
  this.image_url = returnedData.volumeInfo.imageLinks ? returnedData.volumeInfo.imageLinks.smallThumbnail.replace(/^http:\/\//i, 'https://') : 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = returnedData.volumeInfo.title;
  // this.isbn = //TO DO;
  this.author = returnedData.volumeInfo.authors[0] || 'Error, no author found';
  this.description = returnedData.volumeInfo.description;
  //TO DO add sql code here
}

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`up on http://localhost:${PORT}`));
  });
