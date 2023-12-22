var express = require('express');
var router = express.Router();
const models = require('../model');

//We dont need router.get('/messages') here because it mounts at app.js already
router.get('/', (req, res) => {
    return res.send(Object.values(req.context.models.messages));
})

router.get("/:messageId", (req, res) => {
    return res.send(req.context.models.messages[req.params.messageId]);
})

router.post('/', (req, res) => {
    const message = {
        id: 5,
        text: req.body.text,
        userId: req.me.id
    };

    return res.send(message);
})

module.exports = router;