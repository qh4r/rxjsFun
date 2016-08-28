'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _subscriptionScript = require('./subscriptionScript');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//flatMap, mergeMap to aliasy i dziala jak tak selectMany
_Rx2.default.Observable.from([{ name: 'Rafal', surname: 'Kuchar', age: 26, favNumbers: [23, 1337, 7] }, { name: 'Romek', surname: 'Afgan', age: 16, favNumbers: [48, 0, 5, 12] }, { name: 'Łukasz', surname: 'Zdzisz', age: 31, favNumbers: [0, 7, 215] }, { name: 'Iza', surname: 'Schiza', age: 18, favNumbers: [3] }, { name: 'Zbigniew', surname: 'Małysz', age: 24, favNumbers: [] }]).flatMap(function (x) {
    return x.favNumbers;
}).filter(function (x) {
    return x < 100;
}).distinct() //usuwa powtorzenia
.subscribe((0, _subscriptionScript.createSubscription)('flat/merge: '));

// SWITCHMAP -zwraca ostatnia wartosc jesli w czasie dzialania petli wartosc tego elementu sie zmienila
_Rx2.default.Observable.from([{ name: 'Rafal', surname: 'Kuchar', age: 26, favNumbers: [23, 1337, 7] }, { name: 'Romek', surname: 'Afgan', age: 16, favNumbers: [48, 0, 5, 12] }, { name: 'Łukasz', surname: 'Zdzisz', age: 31, favNumbers: [0, 7, 215] }, { name: 'Iza', surname: 'Schiza', age: 18, favNumbers: [3] }, { name: 'Zbigniew', surname: 'Małysz', age: 24, favNumbers: [] }]).switchMap(function (x) {
    return x.favNumbers;
}).subscribe((0, _subscriptionScript.createSubscription)('switchMap: '));

//merge rozwiazuje promisy
_Rx2.default.Observable.range(1, 10).mergeMap(function (x) {
    return new _Rx2.default.Observable(function (obs) {
        return setTimeout(function () {
            obs.next(_Rx2.default.Observable.of([x - 1, x, x + 1]));
            obs.complete();
        }, 1000); //dzialanie merge map konczy sie (i wszyskto idzie dalej) dopiero gdy rozwiazane zostana observable
    });
}).do(function (x) {
    return console.log('zwrocony observable', x);
}).mergeMap(function (x) {
    return x;
}) //ten merge map rozwiazuje observable zwracany w porpzednim next!
.do(function (x) {
    return console.log('wykonano pierwszy merge map: ' + x);
}).mergeMap(function (x) {
    return x;
}) //dopiero ten mergeMap dziala jak select many
.subscribe((0, _subscriptionScript.createSubscription)('promise: '));

//JESLI MERGE MAP MA W RETURNIE TABLICE, TO DZIELI JA JAK SELECT MANY

// JESLI MA OBSERVABLE TO STARA SIE GO UKONCZYC I NIC WIECEJ NIE ROBI

///!!!!!!!!
// MERGE MAP DZIALA TAK SAMO Z PROMISAMI!!!!!!!
_Rx2.default.Observable.range(1, 5).mergeMap(function (x) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            return resolve(x * 2);
        }, 500);
    });
}).subscribe((0, _subscriptionScript.createSubscription)('merge_promise: '));