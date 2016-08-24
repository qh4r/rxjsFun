'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _subscriptionScript = require('./subscriptionScript');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Rx2.default.Observable.interval(1000).take(3).subscribe({
    next: function next(x) {
        console.log('wbudowany itnerwal: ' + x);
    }
});

_Rx2.default.Observable.timer(500).subscribe((0, _subscriptionScript.createSubscription)('wbudowany timer:'));

_Rx2.default.Observable.timer(2000, 200).take(5).subscribe((0, _subscriptionScript.createSubscription)('kilka razy timer 200 + delay 2k:'));

_Rx2.default.Observable.of('hello', 1337, 'cos tam', [2, 3, 5, false, false, '77'], { name: 'Ryba' }).subscribe((0, _subscriptionScript.createSubscription)('itemy: '));

//z obiektu sie tak nie da
_Rx2.default.Observable.from(['kot', 'mysz', 'krzesło', 'pies']).subscribe((0, _subscriptionScript.createSubscription)('itemy z tablicy'));

//iterator wiec mzona robic from z elementow (charow) stringu!
//Rx.Observable.from('dlugi string bardzo dlugi')
//    .subscribe(createSubscription('itemy z stringa: '));

// w esie 6 dziala dla iteratorow i generatorow
//Rx.Observable.from(function*() {
//    let i = 0;
//    while (i++ < 10) yield i;
//}).subscribe(createSubscription('itemy z generatora'));

_Rx2.default.Observable.from([2, 3, 4, 2, 5]).map(function (x) {
    return x * 2;
}).subscribe((0, _subscriptionScript.createSubscription)('z mapem: '));

//throw wywoluje callback errora zawsze
//Rx.Observable.throw(new Error('dupa, symulacja'))
//    .subscribe(createSubscription('errrr rr: '));

_Rx2.default.Observable.empty().subscribe((0, _subscriptionScript.createSubscription)('pusty observable odrazu sie konczy (ma sens gdy chcemy zwracac cos observable dla konwencji)'));

var test = 0;
var deferer$ = _Rx2.default.Observable.defer(function () {
    //tutaj mamy domkniecie
    test++;
    return _Rx2.default.Observable.of(test);
});

//TYLKO SUBSKRYBCJA POWODUJE WYWOLANIE DEFERERA -- take 10 daje 1 wynik
deferer$.take(10).subscribe((0, _subscriptionScript.createSubscription)('defererrr: '));
deferer$.subscribe((0, _subscriptionScript.createSubscription)('defererrr: '));

//Never nigdy sie nie konczy!
_Rx2.default.Observable.never().subscribe((0, _subscriptionScript.createSubscription)('never: '));

//zwraca zakres od (arg 1), ilosc wystapien (arg 2)
_Rx2.default.Observable.range(5, 10).subscribe((0, _subscriptionScript.createSubscription)('range: '));