var express = require("express");
var router = express.Router();

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Mini Messages Board", messages });
});

// GET New message page
router.get("/new", function (req, res, next) {
  res.render("form");
});

// POST information from form.ejs and redirect to main page
router.post("/new", function (req, res, next) {
  messages.push({
    text: req.body.textMessage,
    user: req.body.user,
    added: new Date(),
  });
  res.redirect("/");
});

module.exports = router;
