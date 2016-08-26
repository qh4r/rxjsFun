'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _subscriptionScript = require('./subscriptionScript');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Przyklad cold observable
// subskrybjca zawsze zwraca dane od poczatku i zasubskrybowanie inicjalizuje generacje
var interval$ = _Rx2.default.Observable.interval(1000).take(5);

setTimeout(function () {
    interval$.subscribe((0, _subscriptionScript.createSubscription)('outer_interval: '));

    setTimeout(function () {
        interval$.subscribe((0, _subscriptionScript.createSubscription)('inner_interval: '));
    }, 2000);
}, 2000);

// publish powoduje ze staje sie hot - jest wspulna dla wszystkich a stare wartosci przemilaja
var hot_interval$ = _Rx2.default.Observable.interval(1000).take(5).publish();

// generacja nioe nastapi przed wywolanie connect!
//hot_interval$.connect();

console.log(Date.now());
setTimeout(function () {
    hot_interval$.subscribe((0, _subscriptionScript.createSubscription)('outer_hot: '));
    console.log(Date.now());
    setTimeout(function () {
        hot_interval$.subscribe((0, _subscriptionScript.createSubscription)('inner_hot: '));
        console.log(Date.now());

        setTimeout(function () {
            hot_interval$.connect();
            console.log(Date.now());
            setTimeout(function () {
                return hot_interval$.subscribe((0, _subscriptionScript.createSubscription)('late_to_party_hot: '));
            }, 4000);
            setTimeout(function () {
                return hot_interval$.subscribe((0, _subscriptionScript.createSubscription)('after_hot: '));
            }, 7000);
        }, 1000);
    }, 2000);
}, 2000);

//publish Last - zawsze zwroci osattni
//publish Replay - zawsze zwraca to co juz bylo zachowane (zaelzene od argumentu) podczas rejestracji
var zipped$ = _Rx2.default.Observable.zip(_Rx2.default.Observable.from([32, 12, 3, 45, 2, 31]), _Rx2.default.Observable.of('A', 'B', 'C'), function (x, y) {
    return x + y;
}).map(function (x) {
    console.log(x);
    return x.toLowerCase();
    //}).publishLast();
}).publishReplay(2)
// REFCOUNT - sprawia ze connect sam wywolywany jest podczas pierwszej subskrycji a konczony przy ostatniej unsubscribe
.refCount();
//.share() // < == .publish().refCount() -- taki skrót

// SHARE BARDZO PRZYDAJE SIE PODCZAS OBSLUGI SOCKETOW

zipped$.subscribe((0, _subscriptionScript.createSubscription)('zipped_1: '));
//setTimeout(() => zipped$.connect(), 2000);
setTimeout(function () {
    return zipped$.subscribe((0, _subscriptionScript.createSubscription)('zipped_2: '));
}, 3000);
setTimeout(function () {
    return zipped$.subscribe((0, _subscriptionScript.createSubscription)('zipped_3: '));
}, 6000);