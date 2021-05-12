import View from './view'

const template = `
  <h2>홈</h2>
  <p>여기는 홈 입니다.</p>
`
class Home extends View {
  constructor () {
    const attr = {
      innerHTML: template,
      className: 'home'
    }

    super(attr)
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