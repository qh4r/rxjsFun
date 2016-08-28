'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _subscriptionScript = require('./subscriptionScript');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Rx2.default.Observable.range(1, 10).do(function (x) {
    return console.log(x);
}) // wykonuje operacje nie wplywajaca na ciag,
//do dalszego operatora przekazywane jest to samo co do 'do'
.finally(function (x) {
    return console.log('finally wykonuje sie tylko po zakonczeniu sekwencji w range');
})
//finally wywola sie gdy wywlonae zostanie 'complete' w observablu przed nim
.map(function (x) {
    return x * x;
}).subscribe((0, _subscriptionScript.createSubscription)('range: '));

_Rx2.default.Observable.range(1, 10).map(function (x) {
    return x * x;
}).filter(function (x) {
    return x % 2 != 0;
}).subscribe((0, _subscriptionScript.createSubscription)('fitler: '));

//CONCAT - doadaje jedno po drugin (strumienie)
//Merge - miesza między sobą chunki dwóch strumieni (łącząc je)

_Rx2.default.Observable.interval(500).startWith(-2, 1, 1337, -3) // dodaje elementy na poczatku sekwencji (do poprzedniego observable),
// DODAWANE ODRAZU nie w odstepie 500
.take(3).subscribe(function (x) {
    return console.log('interval1: ' + x);
});

_Rx2.default.Observable.interval(250).merge(_Rx2.default.Observable.interval(500)).take(10).subscribe(function (x) {
    return console.log('merge: ' + x);
}, null, function () {
    _Rx2.default.Observable.range(10, 4) // jesli odwrocily to interval zapcha cala kolejke i merge w concacie nigdy nie  nastapi
    .concat(_Rx2.default.Observable.interval(200)).take(10).subscribe((0, _subscriptionScript.createSubscription)('concat: '));
});

//alternatywne uzycie obu operatorow
//merge uzyty na kolekcjach na ktore nie trzeba oczekiwac laczy je tak jak concat
// kolekcja gotowa od poczatku zostaje wepchnieta na poczatek zwroconel lsity
_Rx2.default.Observable.merge(_Rx2.default.Observable.interval(200).take(5), _Rx2.default.Observable.from([12, 32, 53, 12, 53, 31]), _Rx2.default.Observable.of('kot', 'pies', 'szczeniak', 'szafka', 'teleskop')).subscribe((0, _subscriptionScript.createSubscription)('merge alt: '));