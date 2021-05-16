import Swiper from 'swiper';

class View {
  constructor (attr) {
    this.$refs = {}
    this.$element = this._createElement(attr)
    this.Swiper = Swiper
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
    }

    return div
  }
}

export default View