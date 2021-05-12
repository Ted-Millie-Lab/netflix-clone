import View from './view'

const template = `
  <div class="movie">
    <h2>영화</h2>
    <p>여기는 영화 입니다.</p>  
  </div>
`

class Movie extends View {
  constructor () {
    super()
    
    this.template = template
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