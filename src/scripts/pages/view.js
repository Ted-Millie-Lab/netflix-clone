import Swiper from 'swiper';

class View {
  constructor (attr) {
    this.$refs = {}
    this.$element = this._createElement(attr)
    this.Swiper = Swiper
  }

  lazyLoad (images) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return
        }

        const image = entry.target
        image.onload = () => image.parentNode.classList.add('loaded')
        image.src = image.dataset.src

        io.unobserve(image)
      })
    })

    images.forEach(image => io.observe(image))
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