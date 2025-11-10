import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// Interfaces TypeScript
interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

interface MovieSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

interface MovieDetails {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

// API Service
class MovieApiService {
  private static readonly API_KEY = 'thewdb';
  private static readonly BASE_URL = 'https://www.omdbapi.com';

  static async searchMovies(searchTerm: string, page: number = 1): Promise<MovieSearchResponse> {
    try {
      const response = await axios.get<MovieSearchResponse>(
        `${this.BASE_URL}/?apikey=${this.API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}`
      );

      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'Movie not found');
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to search movies: ${error.message}`);
      }
      throw new Error('Failed to search movies');
    }
  }

  static async getMovieDetails(imdbID: string): Promise<MovieDetails> {
    try {
      const response = await axios.get<MovieDetails>(
        `${this.BASE_URL}/?apikey=${this.API_KEY}&i=${imdbID}&plot=full`
      );

      if (response.data.Response === 'False') {
        throw new Error('Movie details not found');
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch movie details: ${error.message}`);
      }
      throw new Error('Failed to fetch movie details');
    }
  }
}

// Movie Search Component
const MovieSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const moviesPerPage = 10;
  const totalPages = Math.ceil(totalResults / moviesPerPage);

  const handleSearch = async (page: number = 1) => {
    if (!searchTerm.trim()) {
      setError('Please enter a movie title');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await MovieApiService.searchMovies(searchTerm, page);
      setMovies(response.Search);
      setTotalResults(parseInt(response.totalResults));
      setCurrentPage(page);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handlePageChange = (newPage: number) => {
    handleSearch(newPage);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Movie Search
      </h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter movie title..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {hasSearched && !loading && movies.length === 0 && !error && (
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '1rem',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          No movies found. Try a different search term.
        </div>
      )}

      {movies.length > 0 && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {movies.map(movie => (
              <Link
                key={movie.imdbID}
                to={`/movie/${movie.imdbID}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}>
                  <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.png'}
                    alt={movie.Title}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=No+Poster';
                    }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                      {movie.Title}
                    </h3>
                    <p style={{ margin: '0', color: '#666' }}>
                      {movie.Year} • {movie.Type}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentPage <= 1 ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>

              <span style={{ fontSize: '1rem' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentPage >= totalPages ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Movie Details Component
const MovieDetails: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!imdbID) {
        setError('Invalid movie ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const movieDetails = await MovieApiService.getMovieDetails(imdbID);
        setMovie(movieDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Loading movie details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Search
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Movie not found</div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '0.5rem 1rem',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        ← Back to Search
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '3rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div>
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.png'}
            alt={movie.Title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Poster';
            }}
          />
        </div>

        <div style={{ padding: '2rem' }}>
          <h1 style={{ margin: '0 0 1rem 0', color: '#333' }}>
            {movie.Title} ({movie.Year})
          </h1>

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{
              background: '#007bff',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              marginRight: '0.5rem'
            }}>
              {movie.Rated}
            </span>
            <span style={{ color: '#666', marginRight: '1rem' }}>{movie.Runtime}</span>
            <span style={{ color: '#666' }}>{movie.Genre}</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>IMDb Rating:</strong> ⭐ {movie.imdbRating}/10
              </div>
            )}
            {movie.Ratings && movie.Ratings.map((rating, index) => (
              <div key={index} style={{ marginBottom: '0.25rem' }}>
                <strong>{rating.Source}:</strong> {rating.Value}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Plot</h3>
            <p style={{ lineHeight: '1.6', margin: 0 }}>{movie.Plot}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <strong>Director:</strong>
              <div>{movie.Director}</div>
            </div>
            <div>
              <strong>Writer:</strong>
              <div>{movie.Writer}</div>
            </div>
            <div>
              <strong>Actors:</strong>
              <div>{movie.Actors}</div>
            </div>
            <div>
              <strong>Release Date:</strong>
              <div>{movie.Released}</div>
            </div>
            <div>
              <strong>Language:</strong>
              <div>{movie.Language}</div>
            </div>
            <div>
              <strong>Country:</strong>
              <div>{movie.Country}</div>
            </div>
          </div>

          {movie.Awards && movie.Awards !== 'N/A' && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Awards:</strong> {movie.Awards}
            </div>
          )}

          {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Box Office:</strong> {movie.BoxOffice}
            </div>
          )}

          {movie.Production && movie.Production !== 'N/A' && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Production:</strong> {movie.Production}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App2: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <nav
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            color: '#333',
          }}
        >
          🎬 Movie Search App
        </Link>
      </nav>

      <main style={{ padding: '2rem 0' }}>
        <Routes>
          <Route path="/" element={<MovieSearch />} />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
        </Routes>
      </main>
    </div>
  );
};

export default App2;