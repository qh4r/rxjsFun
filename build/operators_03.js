'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _subscriptionScript = require('./subscriptionScript');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//reduce czeka na wykonanie calosci przed przekazaniem dalej
_Rx2.default.Observable.interval(200).startWith(15).take(10)
//REDUCE NIE ROZWIAZUJE PROMISOW
//.reduce((s, x) => new Promise((resolve) => {
//        setTimeout(() =>  resolve(s + x), 500);
//    }, 0
//))
.reduce(function (s, x) {
    return s + x;
}, 0).subscribe((0, _subscriptionScript.createSubscription)('reduce: '));

// scan działa dokładnie jak reduce ale zwraca aktualny wynik po każdym przetworzony elemencie
// (i nie blokuje ruchu do zebrania wszystkich)
_Rx2.default.Observable.interval(200).startWith(15).take(10)
// scan też NIE ROZWIAZUJE PROMISOW
//.scan((s, x) => new Promise((resolve) => {
//        setTimeout(() =>  resolve(s + x), 500);
//    }, 0
//))
.scan(function (s, x) {
    return s + x;
}, 0).subscribe((0, _subscriptionScript.createSubscription)('scan: '));