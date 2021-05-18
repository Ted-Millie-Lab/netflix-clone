import {
  isFunction
} from '../helper/utils'

class View {
  constructor (attr) {
    this.$refs = {}
    this.$el = this._createElement(attr)
  }

  observer (elem, callback) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (isFunction(callback)) {
            callback.call(this, entry.target)
          }
          io.unobserve(entry.target)
        }
      })
    })

    if (elem instanceof NodeList) {
      Array.from(elem).forEach(target => io.observe(target))
    } else {
      io.observe(elem)
    }
  }

  lazyLoad (images) {
    this.observer(images, (image) => {
      image.onload = () => {
        image.parentNode.classList.add('loaded')
      }
      image.src = image.dataset.src
    })
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
      this.$refs[key] = elem

      elem.removeAttribute('ref')
    }

    return div
  }
}

export default View