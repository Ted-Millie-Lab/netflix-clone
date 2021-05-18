const API_URL = 'https://api.themoviedb.org/3'
const IMG_URL = 'https://image.tmdb.org/t/p/w500'
const API_KEY = 'f4c88cfc1ab07d3728969b37401e8946'

const _fetch = (path, query = '') => {
  return window.fetch(`${API_URL + path}?api_key=${API_KEY}&language=ko&${query}`)
    .then(res => res.json())
}

// https://developers.themoviedb.org/3/trending/get-trending
export const tmdb = {
  API_URL,
  IMG_URL,

  // https://developers.themoviedb.org/3/movies/get-movie-lists
  getMovieLists (movie_id) {
    return _fetch(`/movie/${movie_id}/lists`)
  },

  // https://developers.themoviedb.org/3/trending/get-trending
  getTrending ({ media_type = 'movie', time_window = 'week' } = {}) {
    return _fetch(`/trending/${media_type}/${time_window}`)
  },

  // https://developers.themoviedb.org/3/movies/get-movie-videos
  getMovieVideos (id) {
    return _fetch(`/movie/${id}/videos`)
  },

  // https://developers.themoviedb.org/3/movies/get-popular-movies
  getPopularMovie () {
    return _fetch(`/movie/popular`)
  },

  // https://developers.themoviedb.org/3/movies/get-top-rated-movies
  getTopRated () {
    return _fetch(`/movie/top_rated`)
  },

  // https://developers.themoviedb.org/3/genres/get-movie-list
  getMovieList () {
    return _fetch(`/genre/movie/list`)
  },

  // https://developers.themoviedb.org/3/discover/movie-discover  
  getPopularGenre (genre_id) {
    // with_original_language
    return _fetch(`/discover/movie`, `sort_by=popularity.desc&region=KR&with_genres=${genre_id}`)
  }
}