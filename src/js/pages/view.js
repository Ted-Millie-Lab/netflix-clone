class View {
  constructor (attr) {
    this.$element = this._createElement(attr)
  }

  _createElement (attr) {
    const div = document.createElement('div')
    if (attr) {
      for (const key in attr) {
        div[key] = attr[key]
      }
    }

    return div
  }
}

export default View