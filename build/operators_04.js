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

// zip zwroci tylko tyle elementow ile par zdola polaczyc, dopasuje sie do krotszej z kolekcji
_rx2.default.Observable.of('asdfghjl').flatMap(function (x) {
    return x.toUpperCase();
}).zip(_rx2.default.Observable.range(1, 10), function (x, y) {
    return x + y;
}).subscribe((0, _subscriptionScript.createSubscription)('zip:'));

// bierze zawsze najswiezsze z drugiej kolekcji i dodaje je do tego co jest w 1 -- w formie tablicy
// withLatestFrom emituje tylko gdy pojawi sie nowa wartosc w pierwszym zrodle
_rx2.default.Observable.interval(700)
//.withLatestFrom(Rx.Observable.interval(250))
//COMbINE LATEST - emituje wartosc gdy ktorykolwiek z observabli ja emituje
.combineLatest(_rx2.default.Observable.interval(250)).subscribe(function (array) {
    return console.log(array[0] + ' <-latest-> ' + array[1]);
});

_rx2.default.Observable.range(110, 10)
//jesli error jest 2 argumentem to wystapi dopiero po udanej konkatenacji obu zakresow jesli jest pierwszy
// to wypisany zostanie tylko pierwszy zakres a potem wyrzucony zostanie eeror
//.concat(Rx.Observable.range(1,10), Rx.Observable.throw(new Error('test')))
.concat(_rx2.default.Observable.throw(new Error('test')), _rx2.default.Observable.range(1, 10)).retry(3) //powtarza po errorze - dziala tylko na cold observable i ciagnie od nowa
// - error zostanie rzucony dopieo gdy skoncza sie retry
.catch(function (error) {
    return _rx2.default.Observable.of(error);
}) //sposob na handlowanie errorow
.subscribe((0, _subscriptionScript.createSubscription)('tryCatch: '));