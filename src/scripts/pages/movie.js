import View from './view'

const template = `
  <h2>영화</h2>
  <p>여기는 영화 입니다.</p>
`
class Movie extends View {
  constructor (router) {
    super({
      innerHTML: template,
      className: 'movie'
    })

    this._router = router
  }

  created () {
  }

  mounted () {
    // console.log('mounted - Movie')
  }

  destroyed () {
    // console.log('destroyed - Movie')
  }  
}

export default Movie