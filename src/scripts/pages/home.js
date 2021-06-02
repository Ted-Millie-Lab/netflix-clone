import View from './view'
import Swiper from '../lib/swiper'
import SharedTransition from '../lib/shared-transition'
import icons from '../helper/icons'
import {
  repeat,
  addClass,
  removeClass,
  addStyle,
  emptyChild,
  emptyStyle,
  debounce,
  throttle,
  hasClass
} from '../helper/utils'
import {
  tmdb
} from '../services/api'

const template = `
  <div class="nc-tracks" ref="tracks">
  ${(() => {
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
    const tracks = [
      { key: 'trending', title: '지금 뜨는 콘텐츠' },
      { key: 'tv', title: 'TV 영화' },
      { key: 'fantasy', title: '판타지' },
      { key: 'popular', title: '넷플릭스 인기 콘텐츠' },
      { key: 'romance', title: '로맨스' },
      { key: 'animation', title: '애니메이션' },
      { key: 'action', title: '액션' }
    ]

    return tracks.map(track => {
      return `
        <div class="nc-track">
          <h2 class="nc-title">${track.title}</h2>
          <div class="nc-inner">
            <div class="nc-swiper-container">
              <div class="nc-swiper-prev"></div>
              <div class="nc-swiper-wrapper" ref="${track.key}">
                ${repeat(`
                  <div class="nc-swiper-slide">
                    <a href="/">
                      <div class="thumbnail"></div>
                      <div class="metadata">&nbsp;</div>
                    </a>
                  </div>`
                , 7)}
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
        <img src="" ref="smallImg">
        <img src="" ref="largeImg">
        <div class="nc-preview-video" ref="youtubeVideo">
          <div id="player"></div>
        </div>
      </div>
      <div class="nc-preview-metadata" ref="metadata">
        <div class="nc-preview-buttons">
          <div class="left">
            <button class="play" type="button">${icons.play}</button>
            <button class="add" type="button">${icons.add}</button>
            <button class="like" type="button">${icons.like}</button>
            <button class="unlike" type="button">${icons.unlike}</button>
          </div>
          <div class="right">
            <button class="details" ref="details" type="button">${icons.arrow_down}</button>
          </div>
        </div>
        <div class="nc-preview-info">
          <span class="average" ref="average"></span>
          <span class="runtime" ref="runtime"></span>
          <span class="date" ref="releaseDate"></span>
        </div>
        <p class="nc-preview-genres" ref="genres">
        </p>
        <div class="nc-preview-synopsis" ref="synopsis"></div>
      </div>
      <div class="nc-preview-close">
        <button type="button" ref="close"><svg viewBox="0 0 24 24" data-uia="previewModal-closebtn" role="button" aria-label="close" tabindex="0"><path d="M12 10.586l7.293-7.293 1.414 1.414L13.414 12l7.293 7.293-1.414 1.414L12 13.414l-7.293 7.293-1.414-1.414L10.586 12 3.293 4.707l1.414-1.414L12 10.586z" fill="currentColor"></path></svg></button>
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
    this._youtubeTimer = 0
    this._beforeScrollTop = 0
    this._isScrolling = false
  }

  mounted () {
    // 지금 뜨는 콘텐츠
    this._renderSwipeTrending()
    // TV 영화
    this._renderSwipeTV()    
    // 판타지
    this._renderSwipeFantasy()
    // 넷플릭스 인기 콘텐츠
    this._renderSwipePopular()    
    // 애니메이션
    this._renderSwipeAnimation()
    // 로맨스
    this._renderSwipeRomance()
    // 액션
    this._renderSwipeAction()

    this._initEvents()
  }

  destroyed () {
    window.removeEventListener('scroll', this._onScrollStart)
    window.removeEventListener('scroll', this._onScrollEnd)    
    this._swiperGroup.forEach(swiper => swiper.destroy())
    this._swiperGroup = null
  }

  _initEvents () {
    this._onScrollStart = this._onScrollStart.bind(this)
    this._onScrollEnd = debounce(this._onScrollEnd.bind(this), 400)
    window.addEventListener('scroll', this._onScrollStart)
    window.addEventListener('scroll', this._onScrollEnd)
  }

  _renderSwipeTrending () {
    const trending = this.DOM.trending
    this.intersectionObserver(trending, () => {
      tmdb.getTrending()
        .then(({ results }) => this._renderSwipe(trending, results))
    })
  }

  _renderSwipeTV () {
    const tv = this.DOM.tv
    this.intersectionObserver(tv, () => {
      tmdb.getPopularGenre(10770)
        .then(({ results }) => this._renderSwipe(tv, results))
    })
  }  

  _renderSwipeFantasy () {
    const fantasy = this.DOM.fantasy
    this.intersectionObserver(fantasy, () => {
      tmdb.getPopularGenre(14)
        .then(({ results }) => this._renderSwipe(fantasy, results))
    })
  }

  _renderSwipePopular () {
    const popular = this.DOM.popular
    this.intersectionObserver(popular, () => {
      tmdb.getPopularMovie()
        .then(({ results }) => this._renderSwipe(popular, results))
    })
  }  

  _renderSwipeRomance () {
    const romance = this.DOM.romance
    this.intersectionObserver(romance, () => {
      tmdb.getPopularGenre(10749)
        .then(({ results }) => this._renderSwipe(romance, results))
    })
  }

  _renderSwipeAction () {
    const action = this.DOM.action
    this.intersectionObserver(action, () => {
      tmdb.getPopularGenre(28)
        .then(({ results }) => this._renderSwipe(action, results))
    })
  }

  _renderSwipeAnimation () {
    const animation = this.DOM.animation
    this.intersectionObserver(animation, () => {
      tmdb.getPopularGenre(16)
        .then(({ results }) => this._renderSwipe(animation, results))
    })
  }

  _renderSwipe (elem, results) {
    return new Promise((resolve, reject) => {
      emptyChild(elem)
  
      const length = results.length
      for (let i = 0; i < length; i++) {
        const data = results[i]
        const isLast = i === length - 1
        requestAnimationFrame(() => {
          elem.insertAdjacentHTML('beforeend', `
            <div class="nc-swiper-slide" data-id="${data.id}">
              <a href="/">
                <div class="thumbnail">
                  <img data-src="${tmdb.IMG_URL + data.backdrop_path}" alt="">
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
      this.lazyLoad(images)

      this._swiperGroup.push(
        new Swiper(elem, {
          navigation: {
            prevEl: elem.parentNode.querySelector('.nc-swiper-prev'),
            nextEl: elem.parentNode.querySelector('.nc-swiper-next')
          }
        })
      )

      let hoverTimeout = 0
      const mouseenterFn = (event) => {
        hoverTimeout = setTimeout(() => {
          this._showMiniPreview(event)
        }, 400)
      }
      const mouseleaveFn = () => {
        if (hoverTimeout) {
          clearTimeout(hoverTimeout)
        }
      }

      images.forEach(image => {
        image.addEventListener('mouseenter', mouseenterFn)
        image.addEventListener('mouseleave', mouseleaveFn)
      })

      resolve()
    })
  }

  _setMiniPreviewPos (event) {
    const root = document.documentElement
    const fromEl = event.target
    const toEl = this.DOM.preview
    const metaEl = this.DOM.metadata
    const bounds = this._getRect(fromEl)
    const winW = window.innerWidth
    const width = bounds.width * 1.5
    let height = bounds.height * 1.5
    height = height + metaEl.clientHeight

    let top = bounds.top - (height - bounds.height) / 2
    top = top + root.scrollTop

    let left = bounds.left - (width - bounds.width) / 2
    if (left <= 0) {
      left = bounds.left
    } else if ((left + width) >= winW) {
      left = bounds.right - width
    }

    addStyle(toEl, {
      position: 'absolute',
      left: 0,
      top: 0,
      width: `${Math.ceil(width)}px`,
      height: `${Math.ceil(height)}px`,
      transform: `translate(${Math.ceil(left)}px, ${Math.ceil(top)}px)`
    })
  }

  _setMiniPreviewMeta (data) {
    const average = data.vote_average * 10
    const runtime = data.runtime
    const releaseDate = data.release_date.replace(/-/g, '. ')
    const genres = data.genres.slice(0, 3)
    const synopsis = data.overview

    this.DOM.average.insertAdjacentHTML('beforeend', `${average}% 일치`)
    this.DOM.runtime.insertAdjacentHTML('beforeend', `${runtime}분`)
    this.DOM.releaseDate.insertAdjacentHTML('beforeend', releaseDate)
    this.DOM.genres.insertAdjacentHTML('beforeend', genres.map(tag => `<span>${tag.name}</span>`).join(''))
    this.DOM.synopsis.insertAdjacentHTML('beforeend', synopsis)
  }

  // https://developers.google.com/youtube/iframe_api_reference?hl=ko
  _loadYouTubeScript () {
    return new Promise((resolve, reject) => {
      // Load the IFrame Player API code asynchronously.
      const firstScriptTag = document.getElementsByTagName('script')[0]
      const tag = document.createElement('script')
      tag.onload = () => window.YT.ready(resolve)
      tag.onerror = reject
      tag.src = 'https://www.youtube.com/player_api'

      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    })
  }

  // https://developers.google.com/youtube/iframe_api_reference?hl=ko
  async _loadYouTubeVideo (videos) {
    const { results } = videos
    if (!results.length) {
      return
    }

    const video = results.find(v => v.type === 'Trailer' || v.type === 'Teaser')
    if (!video) {
      return
    }

    if (!window.YT) {
      await this._loadYouTubeScript()
    }

    const { youtubeVideo } = this.DOM

    const player = new window.YT.Player('player', {
      width: '100%',
      height: '100%',
      videoId: video.key,
      // https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5&hl=ko
      playerVars: {
        autoplay: 1,
        mute: 1,
        autohide: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        iv_load_policy: 3
      },
      events: {
        onReady: (event) => {
          event.target.playVideo()
        },
        onStateChange: (event) => {
          if (event.data == YT.PlayerState.PLAYING) {
            addClass(youtubeVideo, 'is-active')
          }

          if (event.data === YT.PlayerState.UNSTARTED) {
            removeClass(youtubeVideo, 'is-active')
          }
        }
      }
    })

    // From: https://stackoverflow.com/questions/9914373/ontimeupdate-with-youtube-api/51552777
    // 동영상 끝나기 1초 전에 화면에서 없애는 코드
    // 유튜브 API에 ontimeupdate 이벤트가 따로 없어서 인터벌로 돌림.    
    this._youtubeTimer = setInterval(() => {
      if (player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime()
        const duration = player.getDuration()
        if (currentTime >= (duration - 1)) {
          removeClass(youtubeVideo, 'is-active')

          clearInterval(this._youtubeTimer)
        }
      }
    }, 100)
  }

  async _showMiniPreview (event) {
    const root = document.documentElement
    const fromEl = event.target
    const toEl = this.DOM.preview
    const id = fromEl.closest('[data-id]').dataset.id
    const data = await tmdb.getMovieDetails(id)

    // 메타데이타 정보 설정
    this._setMiniPreviewMeta(data)
    // preview 위치 설정
    this._setMiniPreviewPos(event)

    const sharedTransition = new SharedTransition({
      from: fromEl,
      to: toEl,
      duration: '.26s'
    })

    const {
      smallImg,
      largeImg,
      youtubeVideo,
      average,
      runtime,
      releaseDate,
      genres,
      details,
      synopsis,
      tracks
    } = this.DOM
    const smallImgSrc = fromEl.getAttribute('src')
    const largeImgSrc = smallImgSrc.replace('w500', 'original')

    const reverse = () => {
      sharedTransition.reverse()
    }
    const showPreview = () => {
      this._showPreview(toEl)
      toEl.removeEventListener('mouseleave', reverse)
    }

    const beforePlayStart = () => {
      // w500 사이즈 이미지 로드
      smallImg.src = smallImgSrc

      addClass(toEl.parentNode, 'mini-expanded')

      // 영역 바깥으로 나갈시 원본 상태로 되돌림
      toEl.addEventListener('mouseleave', reverse, { once: true })
    }
    const afterPlayEnd = () => {
      // 원본 이미지 로드
      largeImg.src = largeImgSrc

      // 상세 페이지(?)로 이동
      details.addEventListener('click', showPreview, { once: true })

      // 비디오 로드
      this._loadYouTubeVideo(data.videos)
    }

    const beforeReverseStart = () => {
      removeClass(toEl.parentNode, 'mini-expanded')
      removeClass(toEl.parentNode, 'expanded')
      removeClass(youtubeVideo, 'is-active')
      
    }
    const afterReverseEnd = () => {      
      smallImg.src = ''
      largeImg.src = ''

      if (tracks.style.position === 'fixed') {
        emptyStyle(tracks)
        root.scrollTop = this._beforeScrollTop
      }

      emptyChild(average)
      emptyChild(runtime)
      emptyChild(releaseDate)
      emptyChild(genres)
      emptyChild(synopsis)
      emptyChild(youtubeVideo)

      youtubeVideo.insertAdjacentHTML('beforeend', '<div id="player"></div>')
      clearInterval(this._youtubeTimer)

      details.removeEventListener('click', showPreview)

      this._miniSharedTransition = null
    }

    sharedTransition.on('beforePlayStart', beforePlayStart)
    sharedTransition.on('afterPlayEnd', afterPlayEnd)
    sharedTransition.on('beforeReverseStart', beforeReverseStart)
    sharedTransition.on('afterReverseEnd', afterReverseEnd)
    sharedTransition.play()

    this._miniSharedTransition = sharedTransition
  }

  _showPreview (elem) {
    const root = document.documentElement
    const fromEl = elem
    const toEl = elem

    const sharedTransition = new SharedTransition({
      from: fromEl,
      to: toEl,
      points: {
        from: this._getRect(fromEl)
      },
      duration: '.24s'
    })

    const {
      tracks,
      close
    } = this.DOM

    this._beforeScrollTop = root.scrollTop

    const reverse = () => {
      this._miniSharedTransition.reverse()
    }

    const beforePlayStart = () => {
      removeClass(toEl.parentNode, 'mini-expanded')
      addClass(toEl.parentNode, 'expanded')
      emptyStyle(toEl)

      console.log(this._beforeScrollTop)
      addStyle(tracks, {
        position: 'fixed',
        top: `${-this._beforeScrollTop}px`,
        paddingTop: '68px'
      })
    }

    const afterPlayEnd = () => {
      close.addEventListener('click', reverse, { once: true })
    }

    sharedTransition.on('beforePlayStart', beforePlayStart)
    sharedTransition.on('afterPlayEnd', afterPlayEnd)
    sharedTransition.play()
  }

  // _showPreview (event) {
  //   const root = document.documentElement
  //   const fromEl = event.target
  //   const toEl = this.DOM.preview
  //   const imgsmallImgSrc = fromEl.getAttribute('src')
  //   const imglargeImgSrc = imgsmallImgSrc.replace('w500', 'original')

  //   const hero = new SharedTransition({
  //     from: fromEl,
  //     to: toEl
  //   })

  //   const { tracks, smallImg, largeImg } = this.DOM

  //   const scrollTop = root.scrollTop

  //   hero.on('beforePlayStart', () => {
  //     addStyle(tracks, {
  //       position: 'fixed',
  //       top: `${-scrollTop}px`,
  //       paddingTop: '68px'
  //     })

  //     addClass(toEl.parentNode, 'expanded')

  //     // 빠르게 이미지를 보여주기 위해 기존 작은 이미지 복사
  //     smallImg.src = imgsmallImgSrc
  //   })
  //   hero.on('afterPlayEnd', () => {
  //     // 애니메이션 완료 후 큰 이미지 로드
  //     largeImg.src = imglargeImgSrc

  //     // test
  //     this.DOM.previewClose.addEventListener('click', () => {
  //       hero.reverse()
  //     }, { once: true })
  //   })

  //   hero.on('beforeReverseStart', () => {

  //   })

  //   hero.on('afterReverseEnd', () => {
  //     emptyStyle(tracks)
  //     root.scrollTop = scrollTop
  //     removeClass(toEl.parentNode, 'expanded')

  //     smallImg.src = ''
  //     largeImg.src = ''
  //   })

  //   hero.play()
  // }

  _onScrollStart () {
    if (this._isScrolling) {
      return
    }
    this._isScrolling = true

    addStyle(document.body, {
      pointerEvents: 'none'
    })
  }

  _onScrollEnd () {
    if (!this._isScrolling) {
      return
    }
    this._isScrolling = false

    emptyStyle(document.body)
  }  

  _getRect (elem) {
    const {
      width,
      height,
      left,
      top,
      right
    } = elem.getBoundingClientRect()

    return {
      width,
      height,
      left,
      top,
      right
    }
  }
}

export default Home