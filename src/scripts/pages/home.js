import View from './view'
import Swiper from '../lib/swiper'
import SharedTransition from '../lib/shared-transition'
import {
  repeat,
  addClass,
  removeClass,
  hasClass,
  addStyle,
  emptyStyle,
  debounce
} from '../helper/utils'
import {
  tmdb
} from '../services/api'

const template = `
  <div class="nc-tracks" ref="tracks">
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
        <img src="https://image.tmdb.org/t/p/w500/sF19W36JtRIhAm3VciggSkzBtt.jpg" ref="previewSmall">
        <img src="" ref="previewLarge">
      </div>
      <div class="nc-preview-metadata" ref="previewMetadata">
        <div class="nc-preview-buttons">
          <div>
            <button class="play" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"/></svg></button>
            <button class="add" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="rgba(255,255,255,1)"/></svg></button>
            <button class="like" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3.482a1 1 0 0 0 .817-.423L11.752.85a.5.5 0 0 1 .632-.159l1.814.907a2.5 2.5 0 0 1 1.305 2.853L14.6 8zM7 10.588V19h11.16L21 12.104V10h-6.4a2 2 0 0 1-1.938-2.493l.903-3.548a.5.5 0 0 0-.261-.571l-.661-.33-4.71 6.672c-.25.354-.57.644-.933.858zM5 11H3v8h2v-8z" fill="rgba(255,255,255,1)"/></svg></button>
            <button class="unlike" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M9.4 16H3a2 2 0 0 1-2-2v-2.104a2 2 0 0 1 .15-.762L4.246 3.62A1 1 0 0 1 5.17 3H22a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-3.482a1 1 0 0 0-.817.423l-5.453 7.726a.5.5 0 0 1-.632.159L9.802 22.4a2.5 2.5 0 0 1-1.305-2.853L9.4 16zm7.6-2.588V5H5.84L3 11.896V14h6.4a2 2 0 0 1 1.938 2.493l-.903 3.548a.5.5 0 0 0 .261.571l.661.33 4.71-6.672c.25-.354.57-.644.933-.858zM19 13h2V5h-2v8z" fill="rgba(255,255,255,1)"/></svg></button>
          </div>
          <div>
          <button class="details" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" fill="rgba(255,255,255,1)"/></svg></button>
          </div>
        </div>
      </div>
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
            <div class="nc-swiper-slide" data-id="${data.id}">
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

      let interval = 400
      let timer = 0
      images.forEach(image => {
        image.addEventListener('mouseenter', (event) => {
          timer = setTimeout(() => {
            this._showMiniPreview(event)
          }, interval)
        })
        image.addEventListener('mouseleave', (event) => {
          clearTimeout(timer)
        })
      })

      resolve()
    })
  }

  _setMiniPreviewPosition (event) {
    const root = document.documentElement
    const fromEl = event.target
    const toEl = this.$refs.preview
    const rect = this._getRect(fromEl)
    const winW = window.innerWidth
    const width = rect.width * 1.5
    const height = rect.height * 1.5

    let top = rect.top - (height - rect.height) / 2
    // absolute라 스크롤 값 더 해줌
    top = top + root.scrollTop

    let left = rect.left - (width - rect.width) / 2
    // 왼쪽/오른쪽 넘치는지 확인
    if (left <= 0) {
      left = rect.left
    } else if (left + width >= winW) {
      left = rect.right - width
    }

    addStyle(toEl, {
      position: 'absolute',
      left: 0,
      top: 0,
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${left}px, ${top}px)`
    })
  }

  async _showMiniPreview (event) {
    const fromEl = event.target
    const toEl = this.$refs.preview
    const id = fromEl.closest('[data-id]').dataset.id

    const results = await tmdb.getMovieDetails(id)

    // preview 위치 설정
    this._setMiniPreviewPosition(event)

    const sharedTransition = new SharedTransition({
      from: fromEl,
      to: toEl,
      duration: '.26s'
    })

    const { previewSmall, previewLarge } = this.$refs
    const smallSrc = fromEl.getAttribute('src')
    const largeSrc = smallSrc.replace('w500', 'original')

    const beforePlayStart = () => {
      addClass(toEl.parentNode, 'mini-expanded')
      previewSmall.src = smallSrc

      toEl.addEventListener('mouseleave', () => {
        sharedTransition.reverse()
      }, { once: true })
    }
    const afterPlayEnd = () => {
      previewLarge.src = largeSrc
    }

    const beforeReverseStart = () => {}
    const afterReverseEnd = () => {
      previewSmall.src = ''
      previewLarge.src = ''

      removeClass(toEl.parentNode, 'mini-expanded')
    }

    sharedTransition.on('beforePlayStart', beforePlayStart)
    sharedTransition.on('afterPlayEnd', afterPlayEnd)
    sharedTransition.on('beforeReverseStart', beforeReverseStart)
    sharedTransition.on('afterReverseEnd', afterReverseEnd)
    sharedTransition.play()
  }

  _showPreview (event) {
    const root = document.documentElement
    const fromEl = event.target
    const toEl = this.$refs.preview
    const imgSmallSrc = fromEl.getAttribute('src')
    const imgLargeSrc = imgSmallSrc.replace('w500', 'original')

    const hero = new SharedTransition({
      from: fromEl,
      to: toEl
    })

    const { tracks, previewSmall, previewLarge } = this.$refs

    const scrollTop = root.scrollTop

    hero.on('beforePlayStart', () => {
      addStyle(tracks, {
        position: 'fixed',
        top: `${-scrollTop}px`,
        paddingTop: '68px'
      })

      addClass(toEl.parentNode, 'expanded')

      // 빠르게 이미지를 보여주기 위해 기존 작은 이미지 복사
      previewSmall.src = imgSmallSrc
    })
    hero.on('afterPlayEnd', () => {
      // 애니메이션 완료 후 큰 이미지 로드
      previewLarge.src = imgLargeSrc

      // test
      this.$refs.previewClose.addEventListener('click', () => {
        hero.reverse()
      }, { once: true })
    })

    hero.on('beforeReverseStart', () => {

    })

    hero.on('afterReverseEnd', () => {
      emptyStyle(tracks)
      root.scrollTop = scrollTop
      removeClass(toEl.parentNode, 'expanded')

      previewSmall.src = ''
      previewLarge.src = ''
    })

    hero.play()
  }

  _getRect (elem) {
    const {
      width,
      height,
      left,
      top,
      right,
      bottom
    } = elem.getBoundingClientRect()

    return {
      width,
      height,
      left,
      top,
      right,
      bottom
    }
  }

  _hideMiniPreview (event) {
    clearTimeout(this._previewTimer)
  }
}

export default Home