var express = require('express');
var router = express.Router();
const models = require('../model');

//We dont need router.get('/users') here because it mounts at app.js already
router.get('/', (req, res) => {
  console.log(models);
  return res.send(Object.values(req.context.models.users));
})

router.get('/:userId', (req, res) => {
  return res.send(req.context.models.users[req.params.userId]);
})

module.exports = router;
