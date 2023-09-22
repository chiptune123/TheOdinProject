const Author = require("../models/author");
const asyncHandler = require("express-async-handler");
//This middleware using to caught exception and passing to express error handler
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const author = require("../models/author");

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

    if (!errors.isEmpty()) {
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
  // Get detail of author and all their book
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // If by any case the author is not exist in database or user press the back button but
    // the author has been deleted already, We will guide the users back to authors list page.
    res.redirect("/catalog/authors");
  }

  // Render author_delete.ejs form with specific author and their book data.
  res.render("author_delete", {
    title: "Author Delete",
    author: author,
    author_books: allBooksByAuthor,
  });
});

//Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  // We check again in POST method. If the author has any books associate with then
  // we render the author_delete.ejs form again.
  if (allBooksByAuthor.length > 0) {
    res.render("author_delete", {
      title: "Author Delete",
      author: author,
      author_books: allBooksByAuthor,
    });
  } else {
    // If the author has no associate book then we proceed to delete the author
    // and redirect to author list page
    // authorid is the object in the HTTP POST request body in the form insde author_delete.ejs
    await Author.findByIdAndRemove(req.body.authorid);
    res.redirect("/catalog/authors");
  }
});

//Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id).exec();

  //In case author is not found in the database, guide the user back to author list page
  if (author === null) {
    res.redirect("/catalog/authors");
  }

  res.render("author_form", {
    title: "Author Update",
    author: author,
  });
});

//Handle author update on POST.
exports.author_update_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First Name has non-alphanumeric characters."),
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
    //Extract error from express validator
    const errors = validationResult(req);
    

    let newAuthor = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id  //Specify the old ID or the new ID will be assigned
    })
///////////////////
    console.log(newAuthor);
//////////////////
    
    if(!errors.isEmpty()){
      res.render("author_form",{
        title: "Author Update",
        author: newAuthor,
        errors: errors.array(),
      })
      return;
    } else {
        const theAuthor = await Author.findByIdAndUpdate(req.params.id, newAuthor, {});
        res.redirect(theAuthor.getAuthorUrl);
    }
  }),
];
