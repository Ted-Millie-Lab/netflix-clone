import View from './view'
import {
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
  }

  mounted () {
    this.initPopular()
  }

  destroyed () {

  }

  async initPopular () {
    const { results } = await tmdb.getMoviePopular()
    const popular = this.$refs.popular
    while (popular.hasChildNodes()) {
      popular.removeChild(popular.lastChild)
    }

    for (let i = 0; i < results.length; i++) {
      const data = results[i]
      const isLast = i === results.length - 1
      requestAnimationFrame(() => {
        this.$refs.popular.insertAdjacentHTML('beforeend', `
          <div class="swiper-slide">
            <a href="/">
              <img data-src="${tmdb.IMG_URL + data.backdrop_path}">
            </a>
          </div>
        `)

        if (isLast) {
          const images = this.$refs.popular.querySelectorAll('[data-src]')
          this.lazyLoad(images)
        }
      })
    }

  }
}

export default Home