const express = require('express');
const UserRouter = require('../users/users-router.js');
const server = express();
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const dbConnection = require('../data/dbConfig.js');

const sessionConfig = {
  name: 'secret',
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'knexsessions',
    sidfieldname: 'sessionid',
    createtable: true,
    clearInterval: 1000 * 60 * 30,
  }),
};

server.use(express.json());
server.use(helmet());
server.use(session(sessionConfig));
server.use('/api', UserRouter);

server.get('/', (req, res) => {
  res.send('Its working');
});

module.exports = server;
