'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        var interval = setInterval(function () {
            console.log('geenrating ' + i);
            obv.next('generated -> ' + i++);
        }, intv);

        ///!!!!!!!!!!!!!!!!!
        // ta funkcja zwracana przez observable to taki dispose
        // wykonywana jest przy unsubscribe errorze lub complete!!!!

        // moze byc tez wywolywana przez operatory np TAKE
        return function () {
            clearInterval(interval);
        };
    });
}

var seconds$ = createInterval$(1000);

//const subscription = seconds$.take(5).subscribe(createSubscription('secs: '));


function take(inputObserver, amount) {
    return new _Rx2.default.Observable(function (observer) {
        var sub = inputObserver.subscribe(function (x) {
            observer.next(x);
            if (amount-- == 0) {
                observer.complete();
            }
        });
        //to w celu zachowania ciaglosci
        return function () {
            return sub.unsubscribe();
        };
    });
}

take(seconds$, 8).take(4).subscribe(createSubscription('own take '));

//setTimeout(() => {
//   subscription.unsubscribe();
//}, 4000);