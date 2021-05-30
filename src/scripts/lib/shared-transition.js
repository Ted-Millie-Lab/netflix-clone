import EventEmitter from 'events'

class SharedTransition extends EventEmitter {
  constructor (config) {
    super()

    this.DOM = {
      from: config.from,
      to: config.to
    }

    this._isAnimating = false
    this._isExpanded = false

    this._init()
  }

  _init () {
    
  }

  play () {
    if (this._isAnimating) {
      return
    }
    this._isAnimating = true

    this.emit('beforePlayStart')
    this._setup()

    const fromPos = this._position.from
    const toPos = this._position.to

    this._setProperty(this.DOM.to, {
      position: 'fixed',
      left: 0,
      top: 0,
      transition: 'none',
      transform: `translate(${fromPos.x}px, ${fromPos.y}px) scale(${fromPos.scale})`,
      opacity: 1
    })

    this._animate(toPos.x, toPos.y, toPos.scale)
      .then(() => {
        this._isAnimating = false
        this._isExpanded = true

        this._setProperty(this.DOM.to, '')

        this.emit('afterPlayEnd')
      })
  }

  reverse () {
    if (this._isAnimating) {
      return
    }
    this._isAnimating = true

    this.emit('beforeReverseStart')

    const fromPos = this._position.from
    const toPos = this._position.to

    this._setProperty(this.DOM.to, {
      position: 'fixed',
      left: 0,
      top: 0,
      transform: `translate(${toPos.x}px, ${toPos.y}px) scale(${toPos.scale})`,
    })

    this._animate(fromPos.x, fromPos.y, fromPos.scale)
      .then(() => {
        this._isAnimating = false
        this._isExpanded = false

        this._setProperty(this.DOM.to, '')
        
        this.emit('afterReverseEnd')
      })
  }

  _animate (x, y, scale) {
    return new Promise((resolve, reject) => {
      const toEl = this.DOM.to
      toEl.style.transition = '.4s'
      toEl.style.transform = `translate(${x}px, ${y}px) scale(${scale})`

      toEl.addEventListener('transitionend', resolve, { once: true })
    })
  }

  _setup () {
    this._points = {
      from: this._getRect(this.DOM.from),
      to: this._getRect(this.DOM.to)
    }

    const fromPoint = this._points.from
    const toPoint = this._points.to

    this._position = {
      from: {
        scale: fromPoint.width / toPoint.width,
        x: (fromPoint.width / 2) - (toPoint.width / 2) + fromPoint.left,
        y: fromPoint.top
      },
      to: {
        scale: 1,
        x: toPoint.left,
        y: toPoint.top
      }
    }
  }

  _setProperty (elem, props) {
    if (!props) {
      elem.style = ''
      return
    }

    Object.assign(elem.style, props)

    // visibility: hidden 처리 시 접근성 트리에서 제외 된다라고 mdn에는 나와있으나
    // 국내 스크린 리더기는 아직 처리 안해주는 것 같음
    elem.offsetHeight
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
}

export default SharedTransition
