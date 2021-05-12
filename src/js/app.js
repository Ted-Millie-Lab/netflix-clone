import '../styles/main.scss'

import Router from './router/router'
import routes from './router/routes'

const DOM = {
  container: document.getElementById('container'),
  navLinks: document.querySelectorAll('.links > a')
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
  Array.from(DOM.navLinks).forEach(link => link.addEventListener('click', onNavLink))
}

function onNavLink (event) {
  event.preventDefault()

  const path = event.target.getAttribute('href')
  router.go(path)
}

init()