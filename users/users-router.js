const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Users = require('./users-model.js');
const restricted = require('../users-helpers/users-helpers.js');

router.get('/', (req, res) => {
  res.send('Its working in the users router');
});

router.post('/register', (req, res) => {
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 8); // its 2 ^ 14, not 14 rounds

  Users.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // check password
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'You cannot pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/users', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
