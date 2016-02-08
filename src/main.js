import Rx from 'rx-lite';

var getLoadedImages = function() {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('img'));
  return imgs.filter(function (el) {
      if (el.naturalHeight !== 0) {
        return true;
      }
      else {
        el.parentNode.parentNode.classList.add('loading');
        return false;
      }
    });
}

var intent = function() {
  return {
    scroll: Rx.Observable.fromEvent(window, 'scroll')
      .map(ev => window.scrollY)
      .throttle(32)
      .startWith(window.scrollY),
    load: Rx.Observable.fromEvent(document.querySelectorAll('img'), 'load')
      .map(ev => ev.target)
  };
};

var positionModel = function(actions) {
  var top = 0
  var bottom = window.innerHeight + 200;
  return actions.scroll.map(
    scrollPosition => ({top: top, bottom: bottom, position: scrollPosition})
  );
};

var tileView = function(state) {
  var els = Array.prototype.slice.call(document.querySelectorAll('li'));
  return state.map(({top, bottom, position}) => {
    els = els.filter(el => {
      var y = el.offsetTop - position;
      if (y < bottom) {
        el.classList.remove('offscreen');
        var img = el.querySelector('img');
        var src = img.dataset.src
        if (src != img.src) {
          img.src = src;
        }
        return false;
      }
      else {
        el.classList.add('offscreen');
        return true;
      }
    });
  });
};

var loadingModel = function(actions) {
  return actions.load.map(
    el => el.parentNode.parentNode
  ).startWith(...getLoadedImages())
};

var tileLoadingView = function (state) {
  return state.map(el => {
    el.classList.remove('loading');
  });
};

tileView(positionModel(intent())).subscribe();
tileLoadingView(loadingModel(intent())).subscribe();
