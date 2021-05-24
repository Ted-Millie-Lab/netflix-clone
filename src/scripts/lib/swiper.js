import EventEmitter from 'events'

class Swiper extends EventEmitter {
  constructor (elem, options = {}) {
    super()
    
    this.DOM = { elem: elem }
  
    this.DOM.navigation = options.navigation || {}

    this.DOM.slides = Array.from(this.DOM.elem.children)

    // 현재 인덱스
    this.current = 0
    // 그룹 개수
    this.slideGroupCount = this._calcSlideGroup()
    // 전체 개수
    this.slideGroupTotal = Math.ceil(this.DOM.slides.length / this.slideGroupCount)
    // 슬라이드 너비
    this.slideWidth = 0
    // 애니메이션 중인지 판단
    this.isAnimating = false
    // 애니메이션이 한번이라도 시작되었는지 판단
    this.started = false

    this._onResize = this._onResize.bind(this)

    // 초기화
    this._init()
  }

  get slideWidth () {
    return !this.started ? 0 : 100 / this.slideGroupCount
  }

  set slideWidth (value) {
    return value
  }  

  _init () {
    this._initEvents()
  }

  _initEvents () {
    this.DOM.navigation.prevEl.addEventListener('click', this.prev.bind(this))
    this.DOM.navigation.nextEl.addEventListener('click', this.next.bind(this))
    window.addEventListener('resize', this._onResize)
  }

  _navigate (direction) {
    if (this.isAnimating) {
      return
    }

    this.isAnimating = true

    let translateX = 0

    if (direction === 'next') {
      this.current = this.current < this.slideGroupTotal - 1 ? ++this.current : 0
      translateX = this.slideWidth + (!this.started ? 100 : 200)
    } else {
      this.current = this.current > 0 ? --this.current : this.slideGroupTotal - 1
      translateX = this.slideWidth
    }

    this._animation(translateX)
      .then(() => {
        this._setInfiniteSwipe(!this.started ? '' : direction)
        this.isAnimating = false
      })
  }

  _animation (translateX) {
    return new Promise((resolve, reject) => {
      const elem = this.DOM.elem
      elem.style.transition = 'transform .75s'
      elem.style.transform = `translateX(-${translateX}%)`

      elem.addEventListener('transitionend', resolve, { once: true })
    })
  }
  
  // 아,, 버그..
  _setInfiniteSwipe (direction) {
    const { elem, slides } = this.DOM

    if (!direction) {
      const slide = slides[slides.length - 1]
      elem.prepend(slide)

      this.started = true
    } else {
      // From: https://stackoverflow.com/questions/2007357/how-to-set-dom-element-as-the-first-child
      if (direction === 'next') {
        const slides = this._getFirstGroupSlides()
        elem.append(...slides)
      } else {
        const slides = this._getLastGroupSlides()
        elem.prepend(...slides)
      }
    }

    const translateX = 100 + this.slideWidth
    elem.style.transition = ''
    elem.style.transform = `translateX(-${translateX}%)`

    // 순서바뀌었으니.. 재할당
    this.DOM.slides = Array.from(elem.children)
  }  

  _calcSlideGroup () {
    const totalWidth = this.DOM.elem.clientWidth
    const slideWidth = this.DOM.slides[0].clientWidth

    return Math.round(totalWidth / slideWidth)
  }

  _getFirstGroupSlides () {
    const slides = this.DOM.slides
    return slides.filter((slide, index) => index < this.slideGroupCount)
  }

  _getLastGroupSlides () {
    const slides = this.DOM.slides.reverse()
    return slides.filter((slide, index) => index < this.slideGroupCount)
  }

  _onResize () {
    // if (this.started) {
    //   requestAnimationFrame(() => {
    //     const slideGroupCount = this._calcSlideGroup()
    //     if (slideGroupCount !== this.slideGroupCount) {
    //       const { elem, slides } = this.DOM
    //       if (slideGroupCount > this.slideGroupCount) {
    //         // const slide = slides[slides.length - 1]
    //         // elem.prepend(slide)
    //       } else {
    //         // const slide = slides[0]
    //         // elem.append(slide)
    //       }
  
    //       this.slideGroupCount = slideGroupCount
    //       this.slideGroupTotal = Math.ceil(slides.length / slideGroupCount)
  
    //       const translateX = 100 + this.slideWidth
    //       elem.style.transform = `translateX(-${translateX}%)`
    //     }
    //   })
    // }
  }

  next () {
    this._navigate('next')
  }

  prev () {
    this._navigate('prev')
  }

  destroy () {
    window.removeEventListener('resize', this._onResize)

    // https://stackoverflow.com/questions/684575/how-to-quickly-clear-a-javascript-object
    for (const prop of Object.getOwnPropertyNames(this)) {
      this[prop] = null
    }
  }
}

export default Swiper