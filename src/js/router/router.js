import EventEmitter from 'events'
import {
  isFunction
} from '../helper/utils'

class Router extends EventEmitter {
  constructor ({ entry, routes, initialRoute }) {
    super()

    this._$entry = entry
    this._routes = routes
    this._initialRoute = initialRoute || '/'
    this._previousComponent = null

    this._init()
  }

  _init () {
    this._initRender()
    this._initEvents()
  }

  _initRender () {
    const path = this._initialRoute
    const route = this._getRoute(path)
    if (route) {
      this._render(route)
    }
  }

  _initEvents () {
    window.addEventListener('popstate', this._onpopstate.bind(this))
  }

  _pushState (route) {
    const state = null
    const title = ''
    const path = route.path

    window.history.pushState(state, title, path)
  }

  _render (route) {
    const previousComponent = this._previousComponent
    if (previousComponent instanceof route.component) {
      return
    }

    const $entry = this._$entry
    while ($entry.hasChildNodes()) {
      $entry.removeChild($entry.lastChild)
    }

    if (previousComponent) {
      if (isFunction(previousComponent.destroyed)) {
        previousComponent.destroyed()
      }
    }

    const component = new route.component(this)
    if (isFunction(component.created)) {
      component.created()
    }

    $entry.appendChild(component.$element)

    if (isFunction(component.mounted)) {
      setTimeout(() => component.mounted(), 1)
    }

    this._previousComponent = component
  }

  _getRoute (path) {
    return this._routes.find(route => route.path === path)
  }

  _getPath () {
    return window.location.pathname || this._initialRoute
  }

  _onpopstate () {
    const path = this._getPath()
    const route = this._getRoute(path)
    if (route) {
      this._render(route)
    }
  }

  go (path) {
    const route = this._getRoute(path)
    if (route) {
      this._pushState(route)
      this._render(route)
    }
  }

  back () {

  }
}

export default Router