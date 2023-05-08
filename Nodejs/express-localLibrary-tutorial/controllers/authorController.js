const Author = require("../models/author");
const asyncHandler = require("express-async-handler");
//This middleware using to caught exception and passing to express error handler
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

//Display list of all Authors.
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
  res.render("author_list", { title: "Authors List", author_list: allAuthors });
});

//Display detail page for a specific Author
exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, allBookByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    //No result
    const err = new Error("No Author Found!");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    allBooksByAuthor: allBookByAuthor,
  });
});

//Display Author create form on GET.
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
});

//Handle author create on POST.
exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters"),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create author object with escaped and trimmed date from the form
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if(!errors.isEmpty()){
      // If there are errors, render the form again with sanitized data and error messages.
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // This will process if the data form is valid

      // Save author
      await author.save();
      res.redirect(author.getAuthorUrl);
    }
  }),
];

//Display author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
});

//Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
});

//Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

//Handle author update on POST.
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete post");
});
