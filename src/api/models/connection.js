const config = require('../config');

const { MongoClient } = require('mongodb');
require('dotenv').config();

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let db = null;
const connection = () => (db
    ? Promise.resolve(db)
    : MongoClient.connect(config.mongodb_url, OPTIONS)
      .then((conn) => {
        db = conn.db(config.name);
        return db;
      }));

module.exports = connection;