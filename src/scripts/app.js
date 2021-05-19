import '../styles/main.scss'

import Router from './router/router'
import routes from './router/routes'
import {
  isTouchDevice
} from './helper/utils'

const DOM = {
  html: document.documentElement,
  ncMain: document.getElementById('ncMain')
}

let router = null

function init () {
  if (isTouchDevice()) {
    DOM.html.classList.add('touch-device')
  }

  initRouter()
  initEvents()
}

function initRouter () {
  router = new Router({
    initialRoute: '/',
    entry: DOM.ncMain,
    routes: routes
  })

  window.router = router
}

function initEvents () {
  document.addEventListener('click', onRouteLinks)
}

function onRouteLinks (event) {
  const target = event.target.matches('a') ? event.target : event.target.closest('a')
  if (!target) {
    return
  }
  
  event.preventDefault()

  const path = target.getAttribute('href')
  router.go(path)
}

init()