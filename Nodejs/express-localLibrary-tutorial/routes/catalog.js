const express = require("express");
const router = express.Router();

//require controller module || import controller module to catalog.js
const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const book_instance_controller = require("../controllers/bookinstanceController");

// BOOK ROUTES

// GET catalog homepage.
router.get("/", book_controller.index);

// GET request for creating a book.
router.get("/book/create", book_controller.book_create_get);

// POST request when creating book.
router.post("/book/create", book_controller.book_create_post);

// GET request to deleting a book.
router.get("/book/:id/delete", book_controller.book_delete_get);

// POST request to deleting a book.
router.post("/book/:id/delete", book_controller.book_delete_post);

// GET request to update book.
router.get("/book/:id/update", book_controller.book_update_get);

// POST request to update book.
router.post("/book/:id/update", book_controller.book_update_post);

// GET request for one book.
router.get("/book/:id", book_controller.book_detail);

// GET request for list of all Book items.
router.get("/books", book_controller.book_list);

// AUTHOR ROUTES //

// GET request for creating author.
router.get("/author/create", author_controller.author_delete_get);

// POST request for creating author
router.post("/author/create", author_controller.author_create_post);

// GET request for delete author.
router.get("/author/:id/delete", author_controller.author_delete_get);

// POST request for delete author.
router.post("/author/:id/delete", author_controller.author_delete_post);

// GET request for update author.
router.get("/author/:id/update", author_controller.author_update_get);

// POST request for update author.
router.post("/author/:id/update", author_controller.author_update_post);

// GET request for display an author
router.get("/author/:id", author_controller.author_detail);

// POST request for display list of all authors
router.post("/authors", author_controller.author_list);

// GENRE ROUTES //

// GET request for creating a genre
router.get("/genre/create", genre_controller.genre_create_get);

// POST request for creating a genre
router.post("/genre/create", genre_controller.genre_create_post);

// GET request for delete a genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request for delete a genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request for update a genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request for update a genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for a genre
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for a list of genre
router.get("/genres", genre_controller.genre_list);






