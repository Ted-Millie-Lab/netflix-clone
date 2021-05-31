import {
  isFunction
} from '../helper/utils'

class View {
  constructor (attr) {
    this.DOM = {}
    this.$el = this._createElement(attr)
  }

  intersectionObserver (elem, callback, options = null) {
    elem = elem instanceof NodeList ? Array.from(elem) : elem

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (isFunction(callback)) {
            callback.call(this, entry.target)
          }
          io.unobserve(entry.target)
        }
      })
    }, options)

    if (Array.isArray(elem)) {
      elem.forEach(target => io.observe(target))
    } else {
      io.observe(elem)
    }
  }

  lazyLoad (images, options) {
    this.intersectionObserver(images, (image) => {
      image.onload = () => {
        image.parentNode.classList.add('loaded')
      }
      image.src = image.dataset.src
    }, options)
  }

  _createElement (attr) {
    const div = document.createElement('div')
    if (attr) {
      const keys = Object.keys(attr)
      for (const key of keys) {
        div[key] = attr[key]
      }
    }

    const refs = Array.from(div.querySelectorAll('[ref]'))
    for (const elem of refs) {
      const key = elem.getAttribute('ref')
      this.DOM[key] = elem

      elem.removeAttribute('ref')
    }

    return div
  }
}

export default View