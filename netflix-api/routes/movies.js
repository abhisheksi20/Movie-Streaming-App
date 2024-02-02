const router = require("express").Router();
const Movie = require("../models/movies");
const verifyToken = require("../verifyToken");

//Create

router.post("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Unauthorized: Access Denied");
  }
});

//Update

router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdandUpdate(
        req.params.body,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Unauthorized: Access Denied");
  }
});

//Delete

router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdandDelete();
      res.status(200).json("Your movie has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Unauthorized: Access Denied");
  }
});

//Get

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById();
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});
