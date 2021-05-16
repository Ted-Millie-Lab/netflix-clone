import Home from '../pages/home'
import TV from '../pages/tv'
import Movie from '../pages/movie'

const routes = [
  {
    id: 'home',
    path: '/',
    component: Home
  },
  {
    id: 'tv',
    path: '/tv',
    component: TV
  },
  {
    id: 'movie',
    path: '/movie',
    component: Movie
  }  
]

export default routes
