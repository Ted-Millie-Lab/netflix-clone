import View from './view'

const template = `
  <h2>영화</h2>
  <p>여기는 영화 입니다.</p>
`
class Movie extends View {
  constructor () {
    const attr = {
      innerHTML: template,
      className: 'movie'
    }

    super(attr)
  }

  created () {
    // console.log('created - Movie')
  }

  mounted () {
    // console.log('mounted - Movie')
  }

  destroyed () {
    // console.log('destroyed - Movie')
  }  
}

export default Movie