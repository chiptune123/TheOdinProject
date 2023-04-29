const Book = require("../models/book");
const Author = require("../models/author");
const BookInstance = require("../models/bookinstance");
const Genre = require("../models/genre");

const asyncHandler = require("express-async-handler");
const async = require("async");
const bookinstance = require("../models/bookinstance");
const genre = require("../models/genre");
const { exec } = require("selenium-webdriver/io/exec");
const { promise } = require("selenium-webdriver");

//Display welcome page
// exports.index = asyncHandler(async (req, res, next) => {
//   async.parallel(
//     {
//       book_count(callback) {
//         //Call back as parameter will save the result of function to this object
//         Book.countDocuments({}, callback); //the "callback" is the result of query and this function will return to book_count object
//       },
//       book_instance_count(callback) {
//         BookInstance.countDocuments({}, callback);
//       },
//       book_instance_available_count(callback) {
//         BookInstance.countDocuments({ status: "Available" }, callback);
//       },
//       author_count(callback) {
//         Author.countDocuments({}, callback);
//       },
//       genre_count(callback) {
//         Genre.countDocuments({}, callback);
//       },
//     },
//     //the async.parallel has two parameters. The first parameter we put objects, the second parameter
//     //we put call back which using first-error convention, which mean the results will contain all
//     //the object from the first parameter of async.parallel.
//     (err, results) => {
//       res.render("index", {
//         title: "Local Library Home",
//         error: err,
//         data: results,
//       });
//     }
//   );
// });
//This is old code on MDN and they put new update on April 15, 2023

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Local Library Home",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
});

//Display list of all books.
exports.book_list = asyncHandler(async (req, res, next) => {
  const all_book = await Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();
  res.render("book_list", { title: "Book List", book_list: all_book });
});

//Display detail page for a specific book
exports.book_detail = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (book === null) {
    //No result
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("book_detail", {
    title: book.title,
    book: book,
    book_instances: bookInstances,
  });
});

//Display book create form on GET.
exports.book_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create GET");
});

//Handle book create on POST.
exports.book_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create POST");
});

//Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

//Display book delete form on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

//Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

//Display book update form on POST.
exports.book_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create POST");
});
