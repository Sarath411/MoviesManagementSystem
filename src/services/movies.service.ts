import { Request, Response } from "express";
import Movie from "../models/movies.model";
import redisClient from "../cache/redisClient";

// List all movies
// export const listMovies = async (req: Request, res: Response) => {
//   try {
//     const movies = await Movie.find();
//     res.json(movies);
//   } catch (error: any) {
//     res.status(500).send(error.message);
//   }
// };

export const listMovies = async (req: Request, res: Response) => {
  const cacheKey = "listMovies";

  try {
    // Check if the movies list is cached in Redis
    const cachedMovies = await redisClient.get(cacheKey);

    if (cachedMovies) {
      console.log("Serving from cache");
      return res.json(JSON.parse(cachedMovies));
    }
    // If movies list is not cached, fetch it from MongoDB
    const movies = await Movie.find();
    
    // Set the fetched movies list in the Redis cache with an expiration time
    await redisClient.setEx(cacheKey, 600, JSON.stringify(movies)); // Expires in 10 minutes

    console.log("Serving from DB");
    res.json(movies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Search for a movie by title or genre
export const findMovies = async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ],
    });
    if (movies.length === 0) {
      return res.status(404).send({ message: "No movies found" });
    }

    res.json(movies);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Add a new movie
export const addMovie = async (req: Request, res: Response) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({
      message: "Movie added successfully",
      movie: movie,
    });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

// Update an existing movie
export const updateMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    if (!movie) {
      return res.status(404).send("Movie not found.");
    }
    res.status(201).json({
      message: "Movie updated successfully",
      movie: movie,
    });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

// Delete a movie
export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).send("Movie not found.");
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
