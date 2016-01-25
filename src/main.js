import Rx from 'rx';


var top = 200
var bottom = window.innerHeight - 200;

var scrollSource = Rx.Observable.fromEvent(window, 'scroll');


scrollSource
  .throttle(32)
  .flatMap(e => document.querySelectorAll('li'))
  .map(function (el) {
    var el_top = el.offsetTop - window.scrollY;
    console.log(el_top);
    return [el, el_top + el.offsetHeight > top  && el_top < bottom];
  })
  .map(x => {
    var [el, found] = x;
    found ? el.classList.add('found') : el.classList.remove('found')
  })
  .subscribe()
