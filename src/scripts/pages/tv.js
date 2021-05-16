import View from './view'

const template = `
  <h2>TV 드라마</h2>
  <p>여기는 TV 드라마 입니다.</p>
`
class TV extends View {
  constructor (router) {
    super({
      innerHTML: template,
      className: 'tv'
    })

    this._router = router
  }

  created () {
  }

  mounted () {
    // console.log('mounted - TV')
  }

  destroyed () {
    // console.log('destroyed - TV')
  }  
}

export default TV