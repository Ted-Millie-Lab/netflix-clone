import '../styles/main.scss'

import Router from './router/router'
import routes from './router/routes'

const DOM = {
  container: document.getElementById('container')
}

let router = null

function init () {
  initRouter()
  initEvents()
}

function initRouter () {
  router = new Router({
    initialRoute: '/',
    entry: DOM.container,
    routes: routes
  })

  window.router = router
}

function initEvents () {
  document.addEventListener('click', onRouteLinks)
}

function onRouteLinks (event) {
  const target = event.target
  const tagName = target.tagName.toUpperCase()
  if (tagName === 'A') {
    event.preventDefault()

    const path = target.getAttribute('href')
    router.go(path)
  }
}

init()