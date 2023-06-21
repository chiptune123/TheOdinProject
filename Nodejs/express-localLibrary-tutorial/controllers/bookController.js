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
const { body, validationResult } = require("express-validator");

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
  // Get all the author and genre to use when adding book.
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().exec(),
    Genre.find().exec(),
  ]);

  res.render("book_form", {
    title: "Create Book",
    authors: allAuthors,
    genres: allGenres,
  });
});

//Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty and only 13 numbers")
    .trim()
    .isLength({ min: 1, max: 13 })
    .escape(),
  body("genre.*").escape(),
  // We use a wildcard(*) to sanitize each of genre array entries.

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Get the validation result from the request
    const errors = validationResult(req);

    // After the validation and sanitize data from the request
    // Create a book object contain all the data from the request.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    // If there are errors. Render the form again with the validation and sanitizer data
    if (!errors.isEmpty()) {
      // Get all authors and genres to fill the <option> tag.
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec(),
      ]);

      // Mark our selected genres as checked.
      // We check whether book.genre array, which is the information the user input in,
      // contain any _id field value of allGenre object. If it contain, We mark the
      // property "checked = true" for every genre element in allGenres object.
      for (let genre in allGenres) {
        if (book.genre.includes(allGenres[genre]._id)) {
          allGenres[genre].checked = true;
        }
      }

      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
    } else {
      // If the data form is valid then save the data
      await book.save();
      res.redirect(book.getBookUrl);
    }
  }),
];

//Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  const [book, AllBookInstancesByBook] = await Promise.all([
    Book.findById(req.params.id).exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (book === null) {
    // In case the book can't be found, guide the user back to books list page
    res.redirect("/catalog/books/");
  }

  res.render("book_delete", {
    title: "Author Delete Page",
    Book: book,
    AllBookInstancesByBook: AllBookInstancesByBook,
  });
});

//Display book delete form on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {

});

//Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
  const [book, allAuthors, allGenres] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    Author.find().exec(),
    Genre.find().exec(),
  ]);

  if (book === null) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  for (const genre of allGenres) {
    for (const book_genres of book.genre) {
      if (genre._id.toString() === book_genres._id.toString()) {
        genre.checked = "true";
      }
    }
  }

  res.render("book_form", {
    title: "Update Book",
    authors: allAuthors,
    genres: allGenres,
    book: book,
  });
});

//Display book update form on POST.
exports.book_update_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  //Using the wildcard to sanitize every entries in genre array

  //Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a book object with trimmed/escaped data and old id.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
      _id: req.params.id,
      // We need to specify the old ID or new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // If errors exist. Render form again with sanitized value and errors messages.

      // Get all author and genres data for form
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec(),
      ]);

      // Mark our selected genre as checked.
      for (const genre of allGenres) {
        if (book.genre.includes(genre)) {
          genre.checked = "true";
        }
      }

      res.render("book_form", {
        title: "Update Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
      return;
    } else {
      // If the data form is valid then update the record
      const thebook = await Book.findByIdAndUpdate(req.params.id, book, {});
      //Redirect to book detail page.
      res.redirect(thebook.getBookUrl);
    }
  }),
];
