import View from './view'

const template = `
  <h2>TV 드라마</h2>
  <p>여기는 TV 드라마 입니다.</p>
`
class TV extends View {
  constructor () {
    const attr = {
      innerHTML: template,
      className: 'tv'
    }

    super(attr)
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