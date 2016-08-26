'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _subscriptionScript = require('./subscriptionScript');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//const firstSubject$ = new Rx.Subject;
//
//firstSubject$.subscribe(createSubscription('1st: '));
//
//firstSubject$.next('haha');
//firstSubject$.next('hihi');
//firstSubject$.next('hoho');
//firstSubject$.next('wait for it...');
//setTimeout(() => firstSubject$.complete(), 1000);


var testSubject$ = new _Rx2.default.Subject();
testSubject$.subscribe((0, _subscriptionScript.createSubscription)('test: '));
var timer$ = _Rx2.default.Observable.timer(0, 1000).take(5);

timer$.subscribe(testSubject$);

/// subskrypcje zrwacaja wartosci emitowane od miesjca rejestracji ta ponizasza pomija 2 wartosci
setTimeout(function () {
        return testSubject$.subscribe((0, _subscriptionScript.createSubscription)('timeout 2k: '));
}, 2000);

//praktyczny przyklad

// zwykly subject nie przechowuje stanu poczatkowego ani ostatniego
//const currentUser$ = new Rx.Subject;

//BEHAVIOR SUBJECT - Przyjmuje stan poczatkowy ktory bedzie dostarczony tuz po pierwszej rejestracji
// jesli od momentu utworzenia pojawiaja sie nowe stany to zawsze ostatni stan bedzie dostarczany
// dla nowo rejestrujacego sie elementu
var currentUser$ = new _Rx2.default.BehaviorSubject({ isLoggedIn: false, isAdmin: false });

var isLoggedIn$ = currentUser$.map(function (x) {
        return x.isLoggedIn;
});

var isAdmin$ = currentUser$.map(function (x) {
        return x.isAdmin;
});
isLoggedIn$.subscribe((0, _subscriptionScript.createSubscription)('logged: '));
isAdmin$.subscribe((0, _subscriptionScript.createSubscription)('admin: '));

setTimeout(function () {
        return isLoggedIn$.subscribe((0, _subscriptionScript.createSubscription)('loggedin 2nd: '));
}, 1500);
currentUser$.next({ isLoggedIn: false, isAdmin: false });
setTimeout(function () {
        return currentUser$.next({ name: 'adaś', isLoggedIn: true, isAdmin: false });
}, 1000);
setTimeout(function () {
        return currentUser$.next({ isLoggedIn: false, isAdmin: false });
}, 2000);
setTimeout(function () {
        return currentUser$.next({ name: 'qhr', isLoggedIn: true, isAdmin: true });
}, 3000);

//REPLAY ZAPAMIETUJE CALA KOLEJKE I ZWRACA WSZYSTKIE WARTOSCI OD JEJ POCZATKU PRZY REJESTRACJI
// mpodajac liczbe jako parametr tworzymy buffer i tylko tyle wartosci bedzie przechowywane
var replay$ = new _Rx2.default.ReplaySubject(3);

replay$.subscribe((0, _subscriptionScript.createSubscription)('replay: '));
replay$.next('raz');
setTimeout(function () {
        return replay$.next('dwa');
}, 1000);
setTimeout(function () {
        return replay$.next('trzy');
}, 2000);
setTimeout(function () {
        return replay$.subscribe((0, _subscriptionScript.createSubscription)('delayed: '));
}, 3000);
setTimeout(function () {
        return replay$.next('cztery');
}, 4000);
setTimeout(function () {
        return replay$.next('pięć');
}, 5000);
setTimeout(function () {
        return replay$.subscribe((0, _subscriptionScript.createSubscription)('delayed more: '));
}, 6000);
setTimeout(function () {
        return replay$.next('szesc');
}, 7000);
// ASYNC SUBJECT emituje tylko ostatni stan tuż przed tym jak zostanie ukonczony
// po tym jak zostal completed orazu bedzie daawal ostatnia swoja wartosc kolejnym subskrypcja
var asyncSub$ = new _Rx2.default.AsyncSubject();

asyncSub$.next(1);
asyncSub$.subscribe((0, _subscriptionScript.createSubscription)('async1: '));
asyncSub$.next(2);

setTimeout(function () {
        return asyncSub$.subscribe((0, _subscriptionScript.createSubscription)('async2: '));
}, 2000);

setTimeout(function () {
        console.log('completed');
        asyncSub$.complete();
}, 3000);

setTimeout(function () {
        return asyncSub$.subscribe((0, _subscriptionScript.createSubscription)('async3: '));
}, 4000);

asyncSub$.next(3);