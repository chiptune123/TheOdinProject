var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
  return res.send("Receive a GET HTTP method");
});

router.post("/", (req, res) => {
  return res.send("Receive a POST HTTP method");
});

router.put("/", (req, res) => {
  return res.send("Receive a PUT HTTP method");
});

router.delete("/", (req, res) => {
  return res.send("Receive a DELETE HTTP method");
});


module.exports = router;
