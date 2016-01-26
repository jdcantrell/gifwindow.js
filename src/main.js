import Rx from 'rx';

function intent() {
  return {
    scroll: Rx.Observable.fromEvent(window, 'scroll')
      .map(ev => window.scrollY)
      .throttle(32)
      .startWith(window.scrollY)
  };
}

function model(actions) {
  var top = 0
  var bottom = window.innerHeight;
  return actions.scroll.map(
    scrollPosition => ({top: top, bottom: bottom, position: scrollPosition})
  );
}

function view(state) {
  var els = Array.prototype.slice.call(document.querySelectorAll('li'));
  return state.map(({top, bottom, position}) => {
    els.forEach(el => {
      var y = el.offsetTop - position;
      if (y + el.offsetHeight > top && y < bottom) {
        el.classList.remove('offscreen');
      }
      else {
        el.classList.add('offscreen');
      }
    });
  });
}

view(model(intent())).subscribe();
