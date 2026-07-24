const Datastore = require('nedb');

const db = new Datastore({ inMemoryOnly: true });

module.exports = db;