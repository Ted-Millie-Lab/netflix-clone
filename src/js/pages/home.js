import View from './view'

const template = `
  <div class="home">
    <h2>홈</h2>
    <p>여기는 홈 입니다.</p>  
  </div>
`

class Home extends View {
  constructor () {
    super()

    this.template = template
  }

  created () {
    // console.log('created - home')
  }

  mounted () {
    // console.log('mounted - home')
  }

  destroyed () {
    // console.log('destroyed - home')
  }
}

export default Home