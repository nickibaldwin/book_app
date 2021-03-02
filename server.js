'use strict';

const express = require('express');
require('dotenv').config();
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('./public')); //go look in a folder called public for anything CSS related
// app.get('/', (req, res) => {res.render('./pages/index.ejs')});
app.get('/', (req, res) => {res.render('./pages/searches/new')});

app.listen(PORT, () => console.log(`up on http://localhost:${PORT}`));
