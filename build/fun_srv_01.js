'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//promisy rozwiaza sie nawet jesli sie na nie nie zarejestruje. promise zaczyna wykonanie tuz po utworzeniu
(function () {
    var promise = new Promise(function (resolve, reject) {
        console.log('cos tam');
        return setTimeout(function () {
            console.log('no poszlo');
            resolve('great successs');
        }, 2000);
    });
    promise.then(console.log);

    var promise2 = new Promise(function (resolve, reject) {
        console.log('\tbez rejestracji');
        return setTimeout(function () {
            console.log('\tbez rejestracji tez poszlo no poszlo');
            resolve('\tnikt tego nie odczyta');
        }, 2000);
    });
})();

//WYWOLANIE RRORA RPZERYWA DALSZE WYKONANIE
// w przeciwienstwie promisow observable sa leniwe - nie odpala sie do momentu subskrypcji
(function () {
    var simple$ = new _Rx2.default.Observable(function (observer) {
        console.log('observable started');
        var i = 0;
        (function callback() {
            setTimeout(function () {
                //observer.error('asd')
                observer.next('nowy item ' + i++);
                i < 4 ? callback() : observer.complete('complete');
            }, 1000);
        })();
    });
    //# next, error, complete // w complete undefined
    simple$.subscribe(console.log, console.error, function (x) {
        return console.log('completed => ' + x);
    });

    // observable są reużywalne, w przeciwienstwie do promisow, moge sie nawet zazwbac
    setTimeout(function () {
        console.log('druga runda');
        simple$.subscribe(console.log, console.error, function (x) {
            return console.log('completed => ' + x);
        });
    }, 5000);
})();

(function () {
    var interval$ = new _Rx2.default.Observable(function (observer) {
        var i = 0;
        var interval = setInterval(function () {
            observer.next('nastepnee ' + (i = Math.random() * 10));
            if (i < 1) {
                clearInterval(interval);
                console.log('eot');
                observer.complete();
            }
            if (i > 9) {
                clearInterval(interval);
                observer.error('bum');
            }
        }, 500);
    });

    interval$.subscribe(console.log, console.error);
})();

// nowy sposob na deklaracje obieku zawierajacego funkcje ponizej tak jak fun(){...} === fun: funkcja(){...}
function createSubscription(tag) {
    return {
        next: function next(item) {
            console.log(tag + '.next ' + item);
        },
        error: function error(_error) {
            console.log(tag + '.error ' + (_error.stack || _error));
        },
        complete: function complete() {
            console.log(tag + '.complete');
        }
    };
}

function createInterval$(intv) {
    var i = 0;
    return new _Rx2.default.Observable(function (obv) {
        setInterval(function () {
            obv.next(i++);
        }, intv);
    });
}
var eachSecond$ = createInterval$(1000);
//obiekt sformatowany jak tenn z create subscription (czyli zawieracjacy funkcje next error i complete
// mozna rpzekazac do subscribe
eachSecond$.subscribe(createSubscription('each second: '));