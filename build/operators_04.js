'use strict';

var _rx = require('rxjs/rx');

var _rx2 = _interopRequireDefault(_rx);

var _subscriptionScript = require('./subscriptionScript');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var start = new Date().getTime();
_rx2.default.Observable.interval(100)
//.skip(5)
//.skipWhile(x => (x % 2) == 0) // while nie dziala po tym jak raz przestanie - tu pomija tylko 0
// jest tez takeWhile dzialajace podobnie
.skipUntil(new _rx2.default.Observable(function (obv) {
    // TO NIE COMPLETE A NEXT POWODUJE ODBLOKOWANIE RESZTY CIĄGU!!!!
    setTimeout(function () {
        obv.next('go');
        obv.complete();
    }, 800);
}))
//skip i take Until dzialaja do momentu yielda z przekazanego im observable
.take(20).bufferCount(4)
//.last() //first, last zwracaja pierwszy lub ostatni yield streamu --
// last konczy po jego calym wykonani u.
// first konczy po pierwszym yieldzie
.first()
//.single() //wysypuje sie jesli jest wiecej niz jeden yield
.subscribe(function (x) {
    console.log(new Date() - start + ' single next: ' + x);
}, null, function () {
    console.log(new Date().getTime() - start + ' complete next:');
});