import View from './view'

const template = `
  <h2>홈</h2>
  <p>여기는 홈 입니다.</p>
  <a href="/tv">tv로 이동</a>
`
class Home extends View {
  constructor (router) {
    super({
      innerHTML: template,
      className: 'home'
    })

    this._router = router
  }
 
  created () {
    
  }

  mounted () {
    
  }

  destroyed () {
    // console.log('destroyed - home')
  }
}

export default Home