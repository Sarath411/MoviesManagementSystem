import mongoose from 'mongoose';

interface IMovie {
  title: string;
  genre: string;
  rating: number;
  streamingLink?: string;
}

const movieSchema = new mongoose.Schema<IMovie>({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  streamingLink: { type: String },
});

const Movie = mongoose.model<IMovie>('Movie', movieSchema);

export default Movie;
