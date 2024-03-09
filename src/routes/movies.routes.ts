import express from "express";
import {
  listMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  findMovies,
} from "../services/movies.service";
import { requireAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", listMovies);
router.get("/search", findMovies);
router.post("/", requireAdmin, addMovie);
router.put("/:id", requireAdmin, updateMovie);
router.delete("/:id", requireAdmin, deleteMovie);

export default router;
