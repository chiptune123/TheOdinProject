const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");

//Display list of all Genre.
exports.genre_list =  asyncHandler(async (req,res,next) => {
  res.send("NOT IMPLEMENTED: Genre list");
});

//Display detail page for specific genre.
exports.genre_detail =  asyncHandler(async (req,res,next) => {
  res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
});

//Display create Genre form on GET.
exports.genre_create_get =  asyncHandler(async (req,res,next) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
});

//Handle create Genre on POST
exports.genre_create_post =  asyncHandler(async (req,res,next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
});

//Display delete Genre form on GET.
exports.genre_delete_get =  asyncHandler(async (req,res,next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

//Handle delete Genre on POST.
exports.genre_delete_post =  asyncHandler(async (req,res,next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

//Display update Genre form on GET.
exports.genre_update_get =  asyncHandler(async (req,res,next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

//Handle update Genre on POST
exports.genre_update_post =  asyncHandler(async (req,res,next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
