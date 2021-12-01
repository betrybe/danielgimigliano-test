const { MongoClient } = require('mongodb');
require('dotenv').config();
const config = require('../config');

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let db = null;
const connection = () => (db
    ? Promise.resolve(db)
    : MongoClient.connect(config.mongodbUrl, OPTIONS)
      .then((conn) => {
        db = conn.db(config.dbName);
        return db;
      }));

module.exports = connection;