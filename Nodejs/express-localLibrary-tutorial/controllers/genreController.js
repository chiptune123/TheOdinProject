const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Book = require("../models/book");
const { error } = require("selenium-webdriver");

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

//Display create Genre form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
});

//Handle create Genre on POST
exports.genre_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
});

//Display delete Genre form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

//Handle delete Genre on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

//Display update Genre form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

//Handle update Genre on POST
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
