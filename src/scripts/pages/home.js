import View from './view'
import {
  randomItem,
  repeat
} from '../helper/utils'
import {
  tmdb
} from '../services/api'

const template = `
  <div class="nc-track">
    <h2 class="nc-title">신규 콘텐츠</h2>
    <div class="swiper-container">
      <div class="swiper-wrapper" ref="popular">
        ${repeat('<div class="swiper-slide"><a href="/"></a></div>', 12)}
      </div>
    </div>
  </div>
  <div class="nc-track">
    <h2 class="nc-title">지금 뜨는 콘텐츠</h2>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        ${repeat('<div class="swiper-slide"><a href="/"></a></div>', 12)}
      </div>
    </div>
  </div>
`

class Home extends View {
  constructor (router) {
    super({
      innerHTML: template,
      className: 'nc-home'
    })

    this._router = router
    this._popularMovies = null
  }
 
  async created () {
    const { results } = await tmdb.getMoviePopular()

    const $popular = this.$refs.popular
    while ($popular.hasChildNodes()) {
      $popular.removeChild($popular.lastChild)
    }

    // https://image.tmdb.org/t/p/original/j1FSr3dzaI2o6QipZwWFfzy42Iu.jpg
    for (const data of results) {
      this.$refs.popular.insertAdjacentHTML('beforeend', `
        <div class="swiper-slide">
          <a href="/">
            <img src="https://image.tmdb.org/t/p/original${data.backdrop_path}">
          </a>
        </div>
      `)
    }
    
  }

  mounted () {
    
  }

  destroyed () {
    // console.log('destroyed - home')
  }
}

export default Home