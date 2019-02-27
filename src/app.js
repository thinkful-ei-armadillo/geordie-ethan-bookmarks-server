require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const uuid = require('uuid/v4');
const { NODE_ENV } = require('./config');
// const { bookmarks } = require('./store');
const bookmarks = require('./bookmarks-service');

const app = express();
const router = express.Router();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(router);

app.use(function handleToken(req, res, next) {
  let authToken = req.get('Authorization').split(' ')[1];
  let apiKey = process.env.API_KEY;

  if(authToken !== apiKey) {
    return res.status(401).send('Unauthorized');
  }

  next();
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});


router.route('/bookmarks')
  .get((req, res) => {

    const db = req.app.get('db');

    return bookmarks
      .getAllBookmarks(db)
      .then((data => {
        res.json(data);
      }));
  })
  .post(express.json(), (req, res) => {
    const { title, url, description, rating } = req.body;

    const bookmark = {
      id: uuid(),
      title,
      url,
      description,
      rating
    };

    bookmarks.push(bookmark);

    res.status(204).location(`http://localhost:8000/bookmarks/${bookmark.id}`).end();
  });

router.route('/bookmarks/:id')
  .get((req, res) => {
    let bookmark = bookmarks.find(b => b.id === req.params.id);

    if(bookmark) {
      res.json(bookmark);
    } else {
      res.status(404).send('Bookmark not found');
    }
  })
  .delete((req, res) => {
    let index = bookmarks.findIndex(b => b.id === req.params.id);

    if(index !== -1) {
      bookmarks.splice(index, 1);

      res.status(204).end();
    } else {
      res.status(404).send('Bookmark not found');
    }
  });

module.exports = app;
