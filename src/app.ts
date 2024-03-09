import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database";
import movieRoutes from "./routes/movies.routes";
import userRoutes from "./routes/users.route";
import { requireAuth } from "./middlewares/authMiddleware";

const app = express();
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use(requireAuth);
app.use("/api/movies", movieRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
