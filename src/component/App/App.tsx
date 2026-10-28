import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../services/movieService";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectMovie, setSelectMovie] = useState<Movie | null>(null);

  const handleSubmit = async (query: string) => {
    try {
      setMovies([]);
      setIsLoading(true);

      const movie = await fetchMovies(query);

      if (movie.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(movie);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelect = (movie: Movie) => {
    setSelectMovie(movie);
  };
  const closeModal = () => {
    setSelectMovie(null);
  };

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSubmit} />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {selectMovie && <MovieModal movie={selectMovie} onClose={closeModal} />}
    </>
  );
}
