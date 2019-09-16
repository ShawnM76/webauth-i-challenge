const express = require('express');
const UserRouter = require('../users/users-router.js');
const server = express();
const helmet = require('helmet');

server.use(express.json());
server.use('/api', UserRouter);
server.use(helmet());

server.get('/', (req, res) => {
  res.send('Its working');
});

module.exports = server;
