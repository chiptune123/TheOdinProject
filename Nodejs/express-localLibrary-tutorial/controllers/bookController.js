const Book = require("../models/book");
const Author = require("../models/author");
const BookInstance = require("../models/bookinstance");
const Genre = require("../models/genre");

const async = require("async");
const bookinstance = require("../models/bookinstance");
const genre = require("../models/genre");

//Display welcome page
exports.index = (req, res) => {
  async.parallel(
    {
      book_count(callback) {
        //Call back as parameter will save the result of function to this object
        Book.countDocuments({}, callback); //the "callback" is the result of query and this function will return to book_count object
      },
      book_instance_count(callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count(callback) {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
    },
    //the async.parallel has two parameters. The first parameter we put objects, the second parameter
    //we put call back which using first-error convention, which mean the results will contain all 
    //the object from the first parameter of async.parallel.
    (err, results) => { 
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      })
    }
  );
};

//Display list of all books.
exports.book_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Book list");
};

//Display detail page for a specific book
exports.book_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Book detail: ${req.params.index}`);
};

//Display book create form on GET.
exports.book_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create GET");
};

//Handle book create on POST.
exports.book_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create POST");
};

//Display book delete form on GET.
exports.book_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

//Display book delete form on POST.
exports.book_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

//Display book update form on GET.
exports.book_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

//Display book update form on POST.
exports.book_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create POST");
};
