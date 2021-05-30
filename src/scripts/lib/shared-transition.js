import EventEmitter from 'events'
import {
  repeat,
  addClass,
  removeClass,
  hasClass,
  addStyle,
  emptyStyle
} from '../helper/utils'
class SharedTransition extends EventEmitter {
  constructor (config) {
    super()

    this.DOM = {
      from: config.from,
      to: config.to
    }

    this._duration = config.duration

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

    addStyle(this.DOM.to, {
      position: 'absolute',
      left: 0,
      top: 0,
      transition: 'none',
      transform: `translate(${fromPos.x}px, ${fromPos.y}px) scale(${fromPos.scale})`,
      opacity: 1
    })
    // 어느 css 속성에서 시작점을 못찾는..?
    this.DOM.to.offsetHeight

    this._animate(toPos.x, toPos.y, toPos.scale)
      .then(() => {
        this._isAnimating = false
        this._isExpanded = true

        this.emit('afterPlayEnd')
      })
  }

  reverse () {
    this.emit('beforeReverseStart')

    // 애니메이션 중이 아닐 때만 새로 계산
    if (!this._isAnimating) {
      this._setup()
    }

    const fromPos = this._position.from
    const toPos = this._position.to

    addStyle(this.DOM.to, {
      position: 'absolute',
      left: 0,
      top: 0,
      transform: `translate(${toPos.x}px, ${toPos.y}px) scale(${toPos.scale})`,
    })

    this._animate(fromPos.x, fromPos.y, fromPos.scale)
      .then(() => {
        this._isAnimating = false
        this._isExpanded = false

        emptyStyle(this.DOM.to)

        this.emit('afterReverseEnd')
      })
  }

  _animate (x, y, scale) {
    return new Promise((resolve, reject) => {
      const toEl = this.DOM.to
      toEl.style.transition = this._duration
      toEl.style.transform = `translate(${x}px, ${y}px) scale(${scale})`

      toEl.addEventListener('transitionend', resolve, { once: true })
    })
  }

  _setup () {
    const root = document.documentElement

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
        y: fromPoint.top + root.scrollTop
      },
      to: {
        scale: 1,
        x: toPoint.left,
        y: toPoint.top + root.scrollTop
      }
    }
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
