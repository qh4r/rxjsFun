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

//buffer zwraca tablice z elementow ktore nadeszly w zaleznosci od typu i parametrow
_Rx2.default.Observable.interval(200).take(20).bufferCount(5) //grupuje po ilosci otrzymanych
//.bufferTime(150) //w milisekundach - zwraca grupy w czasie
// jesli w przedziale czasowym nie bedzie wartosci - zwroci psuta tablice
.subscribe((0, _subscriptionScript.createSubscription)('buffer: '));

_Rx2.default.Observable.timer(1000, 500).take(20).buffer(_Rx2.default.Observable.interval(1500)) // w tym wypadku dziala tak jak buffer time
// - tutaj sygnalem naoproznienie buffera jest sygnal z observable
.subscribe((0, _subscriptionScript.createSubscription)('buffer from rx: '));

//To array zbiera calosc i emituje dopiero na evencie complete
_Rx2.default.Observable.interval(200).take(10).toArray().subscribe((0, _subscriptionScript.createSubscription)('toArray: '));