import View from './view'

const template = `
  <div class="tv">
    <h2>TV 드라마</h2>
    <p>여기는 TV 드라마 입니다.</p>  
  </div>
`

class TV extends View {
  constructor () {
    super()
    
    this.template = template
  }

  created () {
    // console.log('created - TV')
  }

  mounted () {
    // console.log('mounted - TV')
  }

  destroyed () {
    // console.log('destroyed - TV')
  }  
}

export default TV