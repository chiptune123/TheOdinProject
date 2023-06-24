const BookInstance = require("../models/bookinstance");
const asyncHandler = require("express-async-handler");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const book = require("../models/book");

//Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate("book").exec();
  res.render("bookinstance_list", {
    title: "Book Instances",
    bookinstance_list: allBookInstances,
  });
});

//Display detail page for specific BookInstance
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstances = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (bookInstances === null) {
    let err = new Error("Book Instances Not Found!");
    err.status = 404;
    return next(err);
  }

  res.render("bookinstance_detail", {
    title: "Book Instance detail",
    bookinstance: bookInstances,
  });
});

//Display BookInstance create form on GET
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").exec();

  res.render("bookinstance_form", {
    title: "Create Book Instance",
    book_list: allBooks,
  });
});

//Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body("book", "Book must be specified").trim().isLength({ min: 10 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors in the request
    const errors = validationResult(req);

    // Create a bookinstance object with validation and sanitize data
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // If there are errors
      // Render form again with sanitizer data and error messages.
      const allBooks = await Book.find({}, "title").exec();

      // Loop through the allBooks and add 1 more "check" property
      // to save the user's input value
      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book_ID: bookinstance.book._id,
        errors: errors.array(),
        bookinstance: bookinstance,
      });
      return;
    } else {
      // If the data in the form are valid
      await bookinstance.save();
      res.redirect(bookinstance.GetBookInstanceUrl);
    }
  }),
];

//Display BookInstance delete form on GET
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();
  // In case the bookInstance is not exist, Guide user back to
  if (bookInstance == null) {
    res.redirect("/catalog/bookinstances");
  }

  res.render("bookinstance_delete", {
    title: "Book instance delete",
    bookInstance: bookInstance,
  });
});

//Handle BookInstance delete on POST
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id).exec();

  // We check if the existence of the book instance one more time before delete
  // If book instance not found, guide user back to all book instance page (bookinstance_list.ejs)
  if (bookInstance === null) {
    res.redirect("/catalog/bookinstances");
  } else {
    // Process to delete the book instance
    await BookInstance.findByIdAndDelete(req.body.bookInstanceId);
    res.redirect("/catalog/bookinstances");
  }
});

//Display BookInstance update form on GET
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});

//Handle BookInstance update on POST
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});
