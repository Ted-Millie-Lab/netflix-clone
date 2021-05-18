import EventEmitter from 'events'

class Swiper extends EventEmitter {
  constructor (elem) {
    super()

    this.DOM = { elem: elem }
    this.DOM.slides = Array.from(this.DOM.elem.children)

    // 현재 인덱스
    this.current = 0
    // 전체 개수
    this.totalSize = this.DOM.slides.length

    // 초기화
    this._init()
  }

  _init () {
    this._initEvents()
  }

  _initEvents () {
    
  }
}

export default Swiper