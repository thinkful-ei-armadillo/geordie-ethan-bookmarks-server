/* global supertest */

const knex = require('knex');
const app = require('../src/app');
const SETTINGS = require('../src/config');

const db = knex({
  client: 'pg',
  connection: SETTINGS.TEST_DB_URL,
});

app.set('db', db);

after('disconnect from DB', () => {
  db.destroy();
});

describe('GET /bookmarks', () => {

  const seedData = [
    { id: 1, title: 'Alpha', url: 'http://example.com', description: 'a description', rating: 1 },
    { id: 2, title: 'Bravo', url: 'http://example.com', description: 'a description', rating: 2 },
    { id: 3, title: 'Charlie', url: 'http://example.com', description: 'a description', rating: 3 },
    { id: 4, title: 'Delta', url: 'http://example.com', description: 'a description', rating: 4 },
    { id: 5, title: 'Echo', url: 'http://example.com', description: 'a description', rating: 5 },
  ];

  beforeEach('empty,populate table', () => {
    return db('bookmarks').truncate().then(() => {

      return db('bookmarks').insert(seedData);
    });
  });

  afterEach('empty table', () => {
    return db('bookmarks').truncate();
  });

  it('Should return expected data', () => {

    return supertest(app)
      .get('/bookmarks')
      .set('Authorization', `Bearer ${process.env.API_KEY}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((resp) => {

        expect(resp.body).to.deep.equal(seedData);
      });
  });
});

describe('POST /bookmarks', () => {

  beforeEach('xxxxx', () => {
    // do something
  });

  afterEach('ttttttt', () => {
    // cleanup
  });

  it('yyyyyy', () => {
    // do stuff
  });
});

describe('GET /bookmarks/:id', () => {

  beforeEach('xxxxx', () => {
    // do something
  });

  afterEach('ttttttt', () => {
    // cleanup
  });

  it('yyyyyy', () => {
    // do stuff
  });
});

describe('GET /bookmarks/:id', () => {

  beforeEach('xxxxx', () => {
    // do something
  });

  afterEach('ttttttt', () => {
    // cleanup
  });

  it('yyyyyy', () => {
    // do stuff
  });
});
