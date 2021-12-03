import * as controller from './controller';
import { getParameters } from './helpers';

if (module.hot) {
  module.hot.accept();
}

class Route {

  #routes = {
    "/": null,
    "/recipes/{id}": controller.controlRecipe
  };

  init() {
    this._set();
  }

  //set route
  _set() {
    const path = window.location.pathname;
    Object.keys(this.#routes).forEach(route => {
      if (route === '/') {
        if (path === '/')
          return;
        else
          return '404 Not Found!'
      } else {
        const [firstPath, secondPath] = route.split('/');
        if (path.substr(1).startsWith(firstPath)) {
          if (secondPath) {
            const id = path.substr(1).split('/')?.[1];
            this.#routes[route](id);
          }
        } else {
          return '404 Not Found!'
        }
      }
    });
  }

  get(route) {
    if (route === '/') return '/';
    const [firstPath, secondPath] = route.split('/').filter(path => path != "");
    if (Object.keys(this.#routes).find(routeKey => routeKey.startsWith(`/${firstPath}`))) {
      const params = getParameters();
      const paramsString = Object.keys(params).length > 0 ? '?' + Object.keys(params).map(param => `${param}=${params[param]}`).join('&') : '';
      return `\/${firstPath}\/${secondPath}${paramsString}`;
    } else {
      return '#'
    }

  }

}

const route = new Route();
window.addEventListener('load', async function () {
  await controller.init();
  route.init();
});

export default route;