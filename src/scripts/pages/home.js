import View from './view'
import Swiper from '../lib/swiper'
import SharedTransition from '../lib/shared-transition'
import {
  repeat,
  debounce
} from '../helper/utils'
import {
  tmdb
} from '../services/api'

const template = `
  <div class="nc-tracks">
    ${(() => {
      const tracks = [
        { key: 'trending',title: '지금 뜨는 콘텐츠' },
        { key: 'animation', title: '애니메이션' },
        { key: 'romance', title: '로맨스' },
        { key: 'comedy', title: '코메디' }
      ]

      return tracks.map(track => {
        return `
          <div class="nc-track">
            <h2 class="nc-title">${track.title}</h2>
            <div class="nc-inner">
              <div class="nc-swiper-container">
                <div class="nc-swiper-prev"></div>
                <div class="nc-swiper-wrapper" ref="${track.key}">
                  ${repeat('<div class="nc-swiper-slide"><a href="/"><div class="thumbnail"></div><div class="metadata">&nbsp;</div></a></div>', 12)}
                </div>
                <div class="nc-swiper-next"></div>
              </div>
            </div>
          </div>
        `
      }).join('')
    })()}
  </div>
  <div class="nc-preview">
    <div class="nc-preview-inner" ref="preview">
      <div class="nc-preview-thumbnail">
        <img src="" ref="small">
        <img src="" ref="large">
      </div>
      <div class="nc-preview-metadata" ref="metadata"></div>
      <div class="nc-preview-close">
        <button type="button" ref="previewClose"><svg viewBox="0 0 24 24" data-uia="previewModal-closebtn" role="button" aria-label="close" tabindex="0"><path d="M12 10.586l7.293-7.293 1.414 1.414L13.414 12l7.293 7.293-1.414 1.414L12 13.414l-7.293 7.293-1.414-1.414L10.586 12 3.293 4.707l1.414-1.414L12 10.586z" fill="currentColor"></path></svg></button>
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
    this._swiperGroup = []
    this._previewTimer = 0
  }

  mounted () {
    // 0: {id: 28, name: "액션"}
    // 1: {id: 12, name: "모험"}
    // 2: {id: 16, name: "애니메이션"}
    // 3: {id: 35, name: "코미디"}
    // 4: {id: 80, name: "범죄"}
    // 5: {id: 99, name: "다큐멘터리"}
    // 6: {id: 18, name: "드라마"}
    // 7: {id: 10751, name: "가족"}
    // 8: {id: 14, name: "판타지"}
    // 9: {id: 36, name: "역사"}
    // 10: {id: 27, name: "공포"}
    // 11: {id: 10402, name: "음악"}
    // 12: {id: 9648, name: "미스터리"}
    // 13: {id: 10749, name: "로맨스"}
    // 14: {id: 878, name: "SF"}
    // 15: {id: 10770, name: "TV 영화"}
    // 16: {id: 53, name: "스릴러"}
    // 17: {id: 10752, name: "전쟁"}
    // 18: {id: 37, name: "서부"}

    // 지금 뜨는 콘텐츠
    this._renderSwipeTrending()
    // 애니메이션
    this._renderSwipeAnimation()
    // 로맨스
    this._renderSwipeRomance()
    // 코메디
    this._renderSwipeComedy()
  }

  destroyed () {
    this._swiperGroup.forEach(swiper => swiper.destroy())
    this._swiperGroup = null
  }

  _renderSwipeTrending () {
    const trending = this.$refs.trending
    this.observer(trending, () => {
      tmdb.getTrending()
        .then(({ results }) => this._renderSwipe(trending, results))
    })
  }  

  _renderSwipeAnimation () {
    const animation = this.$refs.animation
    this.observer(animation, () => {
      tmdb.getPopularGenre(16)
        .then(({ results }) => this._renderSwipe(animation, results))
    })
  }

  _renderSwipeRomance () {
    const romance = this.$refs.romance
    this.observer(romance, () => {
      tmdb.getPopularGenre(10749)
        .then(({ results }) => this._renderSwipe(romance, results))
    })
  }

  _renderSwipeComedy () {
    const comedy = this.$refs.comedy
    this.observer(comedy, () => {
      tmdb.getPopularGenre(35)
        .then(({ results }) => this._renderSwipe(comedy, results))
    })
  }

  _renderSwipe (elem, results) {
    return new Promise((resolve, reject) => {
      while (elem.hasChildNodes()) {
        elem.removeChild(elem.lastChild)
      }
  
      const length = results.length
      for (let i = 0; i < length; i++) {
        const data = results[i]
        const isLast = i === length - 1
        requestAnimationFrame(() => {
          elem.insertAdjacentHTML('beforeend', `
            <div class="nc-swiper-slide">
              <a href="/">
                <div class="thumbnail">
                  <img data-src="${tmdb.IMG_URL + data.backdrop_path}">
                </div>
                <div class="metadata">${data.title}</div>
              </a>
            </div>
          `)
  
          if (isLast) {
            this._setupSwipe(elem)
              .then(() => resolve())
          }
        })
      }
    })
  }

  _setupSwipe (elem) {
    return new Promise((resolve, reject) => {
      const images = Array.from(elem.querySelectorAll('[data-src]'))
      this.lazyLoad(images, { threshold: 0.1 })

      this._swiperGroup.push(
        new Swiper(elem, {
          navigation: {
            prevEl: elem.parentNode.querySelector('.nc-swiper-prev'),
            nextEl: elem.parentNode.querySelector('.nc-swiper-next')
          }
        })
      )

      images.forEach(image => {
        // image.addEventListener('click', this._showPreview.bind(this))

        image.addEventListener('mouseenter', this._showMiniPreview.bind(this))

        // image.addEventListener('mouseleave', this._hideMiniPreview.bind(this))
      })

      resolve()
    })
  }

  _setMiniPreviewPos (event) {
    const fromEl = event.target
    const toEl = this.$refs.preview
    const scale = 1.5
    const { width,  height, left, top } = this._getRect(fromEl)

    const _width = width * scale
    const _height = height * scale
    const _left = left - (_width - width) / 2
    const _top = top - (_height - height) / 2

    Object.assign(toEl.style, {
      position: 'fixed',
      left: 0,
      top: 0,
      width: `${_width}px`,
      height: `${_height}px`,
      transform: `translate(${_left}px, ${_top}px)`
    })
  }

  _showMiniPreview (event) {
    const fromEl = event.target
    const toEl = this.$refs.preview

    // 위치 설정
    this._setMiniPreviewPos(event)
  }

  _showPreview (event) {
    const fromEl = event.target
    const toEl = this.$refs.preview
    const imgSmallSrc = fromEl.getAttribute('src')
    const imgLargeSrc = imgSmallSrc.replace('w500', 'original')

    const hero = new SharedTransition({
      from: fromEl,
      to: toEl
    })

    hero.on('beforePlayStart', () => {
      // 빠르게 이미지를 보여주기 위해 기존 작은 이미지 복사
      this.$refs.small.src = imgSmallSrc
    })
    hero.on('afterPlayEnd', () => {
      toEl.parentNode.classList.add('expanded')

      // 애니메이션 완료 후 큰 이미지 로드
      this.$refs.large.src = imgLargeSrc

      // test
      this.$refs.previewClose.addEventListener('click', () => {
        hero.reverse()
      }, { once: true })
    })

    hero.on('beforeReverseEnd', () => {
      
    })

    hero.on('afterReverseEnd', () => {
      toEl.parentNode.classList.remove('expanded')
      this.$refs.small.src = ''
      this.$refs.large.src = ''
    })

    hero.play()

    // clearTimeout(this._previewTimer)
    // this._previewTimer = setTimeout(() => {
    //   const fromElem = event.target
    //   const toElem = this.$refs.preview
    //   const fromPoint = this._getRect(fromElem)
    //   const toPoint = (() => {
    //     const root = document.documentElement
    //     const width = fromPoint.width * 1.5
    //     const height = fromPoint.height * 1.5
    //     const top = fromPoint.top - ((height - fromPoint.height) / 2) + root.scrollTop
    //     let left = fromPoint.left - ((width - fromPoint.width) / 2)
    //     if (left <= 0) {
    //       left = fromPoint.left
    //     } else if ((left + width) >= root.clientWidth) {
    //       left = fromPoint.right - width
    //     }

    //     return {
    //       width,
    //       height,
    //       left,
    //       top
    //     }
    //   })()

    //   const hero = new SharedTransition({
    //     from: fromElem,
    //     to: toElem,
    //     points: {
    //       from: fromPoint,
    //       to: toPoint
    //     }
    //   })

    //   const imgSmallSrc = fromElem.getAttribute('src')
    //   const imgLargeSrc = imgSmallSrc.replace('w500', 'original')      
    //   this.$refs.small.src = imgSmallSrc
    //   this.$refs.large.src = imgLargeSrc

    //   hero.animate({

    //   })
    // }, 500)

    // setTimeout(() => {
    //   fromElem.style.transition = `transform .24s`
    //   fromElem.style.transform = `scale(1.5)`
    //   fromElem.addEventListener('transitionend', () => {
    //     const toRect = fromElem.getBoundingClientRect()
    //     const toWdith = toRect.width
    //     const toHeight = toRect.height
    //     const toLeft = toRect.left
    //     const toTop = toRect.top + window.scrollY
    //     fromElem.style.cssText = `
    //       display: block;
    //       width: ${toWdith}px;
    //       height: ${toHeight}px;
    //       left: ${toLeft}px;
    //       top: ${toTop}px;
    //       transition: none;
    //       transform: none;
    //     `
    //   }, { once: true })

    //   fromElem.addEventListener('mouseleave', this._hideMiniPreview.bind(this), { once: true })
    // }, 1)

    // const from = target.getBoundingClientRect()
    // const imgSmallSrc = target.getAttribute('src')
    // const imgLargeSrc = imgSmallSrc.replace('w500', 'original')

    // this.$refs.small.src = imgSmallSrc
    // this.$refs.large.src = imgLargeSrc

    // setTimeout(() => {
    //   this.$refs.preview.style.transform = `scale(1.5)`

    //   this.$refs.preview.addEventListener('transitionend', () => {
    //     const to = this.$refs.preview.getBoundingClientRect()

    //     this.$refs.preview.style.cssText = `
    //       display: block;
    //       width: ${to.width}px;
    //       height: ${to.height}px;
    //       left: ${to.left}px;
    //       top: ${to.top + window.scrollY}px;
    //       transition: none;
    //       transform: none;
    //     `

    //   }, { once: true })
    // }, 250)
  }

  _getRect (elem) {
    const {
      width,
      height,
      left,
      top
    } = elem.getBoundingClientRect()

    return {
      width,
      height,
      left,
      top
    }
  }

  _hideMiniPreview (event) {
    clearTimeout(this._previewTimer)
  }
}

export default Home