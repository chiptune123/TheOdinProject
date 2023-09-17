const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Book = require("../models/book");
const { error } = require("selenium-webdriver");
const { body, validationResult } = require("express-validator");
const genre = require("../models/genre");

//Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const genre_list = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre_list", { title: "Genre Lists", genre_list });
});

//Display detail page for specific genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  //Get details of genre and all associate books with that genre (In parallel)
  const [genre, BooksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    //No genre results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: BooksInGenre,
  });
});

//Display create Genre form on GET. | We don't need asyncHandler here because no code can throw exception.

exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

//Handle create Genre on POST
exports.genre_create_post = [
  //Validate and sanitize the "name" field.
  //We use "body" here is because data is store in Request message body
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  //Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    //Extract validation error from the request
    const errors = validationResult(req);

    //Create a new genre object with escaped and trimmed data
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      //If there are errors. Render the form again with sanitized value/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data form is valid.
      // Check if Genre with the same name exist.
      const genreExists = await Genre.findOne({ name: req.body.name }).exec();
      if (genreExists) {
        //Genre exist , redirect its to detail page.
        res.redirect(genreExists.GetGenreUrl);
      } else {
        await genre.save();
        // New Genre saved. redirect to genre detail page
        res.redirect(genre.GetGenreUrl);
      }
    }
  }),
];

//Display delete Genre form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, AllBooksByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    //If genre is not found then return the user to genre_list page
    res.redirect("/catalog/genres");
  }

  res.render("genre_delete", {
    title: "Genre Delete",
    Genre: genre,
    genre_book: AllBooksByGenre,
  });
});

//Handle delete Genre on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, AllBooksByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  // Check again on POST method to make sure genre doesn't have any associate book
  // If associate books is existed, render the genre_delete.ejs again with the data
  // of associate books
  if (AllBooksByGenre.length > 0) {
    res.render("genre_delete", {
      title: "Genre Delete",
      Genre: genre,
      Genre_books: AllBooksByGenre,
    });
  } else {
    // Delete the Genre if it has no associate books and redirect to genre_list.ejs page
    await Genre.findByIdAndRemove(req.params.id);
    res.redirect("/catalog/genres");
  }
});

//Display update Genre form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const [genre, AllBooksByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    const err = new Error("Genre Not Found!");
    err.status = 404;
    return next(err);
  }

  res.render("genre_form", {
    title: "Update Genre",
    genre: genre,
    genre_books: AllBooksByGenre,
  });
});

//Handle update Genre on POST
exports.genre_update_post = [
  body("GenreName", "Genre name need more than 1 character and must not empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    //Extract the validation errors fromm the request
    const errors = validationResult(req);

    const NewGenre = new Genre({
      name: req.body.GenreName,
      _id: req.params.id,
    });

    //Check if NewGenre is equal with any genre that already exist, if true, return error
    const [genre, AllBooksByGenre, AllGenres] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      Book.find({ genre: req.params.id }, "title summary").exec(),
      Genre.find().exec(),
    ]);

    //Check the new genre name with every genre to prevent duplicated genre
    for (let eachGenre in AllGenres) {
      const check = AllGenres[eachGenre].name;
      if (AllGenres[eachGenre].name == NewGenre.name) {
        const DuplicateError = new Error("Genre is already exist!");
        res.render("genre_form", {
          title: "Update Genre",
          genre: genre,
          genre_books: AllBooksByGenre,
          DuplicateError: DuplicateError,
        });
        return;
      }
    }

    if (!errors.isEmpty()) {
      // If errors exist. Render form again with sanitized value and errors messages.

      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        genre_books: AllBooksByGenre,
        errors: errors.array(),
      });
      return;
    } else {
      //If the data form is corrected and no errors, update the record with the new genre data
      //and redirect to the URL of the new genre
      const theGenre = await Genre.findByIdAndUpdate(req.params.id, NewGenre, {});
      res.redirect(theGenre.GetGenreUrl);
    }
  }),
];
