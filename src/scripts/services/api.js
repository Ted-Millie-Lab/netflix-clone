const API_URL = 'https://api.themoviedb.org/3'
const IMG_URL = 'https://image.tmdb.org/t/p/original'
const API_KEY = 'f4c88cfc1ab07d3728969b37401e8946'

const _fetch = (path) => {
  return window.fetch(`${API_URL + path}?api_key=${API_KEY}&language=ko`)
}

// https://developers.themoviedb.org/3/trending/get-trending
export const tmdb = {
  API_URL,
  IMG_URL,

  getTrending ({ media_type = 'movie', time_window = 'week' } = {}) {
    return _fetch(`/trending/${media_type}/${time_window}`)
      .then(res => res.json())
  },

  // https://developers.themoviedb.org/3/movies/get-movie-videos
  getMovieVideos (id) {
    return _fetch(`/movie/${id}/videos`)
      .then(res => res.json())
  },

  // https://developers.themoviedb.org/3/movies/get-popular-movies
  getMoviePopular () {
    return _fetch(`/movie/popular`)
      .then(res => res.json())    
  }
}