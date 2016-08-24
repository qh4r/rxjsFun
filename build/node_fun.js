'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _subscriptionScript = require('./subscriptionScript');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_fs2.default.readdir('./', function (err, res) {
    if (err) {
        return console.log(err);
    }
    console.log(res);
});

var readdir$ = _Rx2.default.Observable.bindNodeCallback(_fs2.default.readdir);
var readFile$ = _Rx2.default.Observable.bindNodeCallback(_fs2.default.readFile);
//Rx.Observable.of('asdsadd dsadd asdasd asd asdsa sadas').flatMap(x => x.split(' ')).subscribe(createSubscription('split: '));

readdir$('./').flatMap(function (x) {
    return x;
}).subscribe((0, _subscriptionScript.createSubscription)('callbackiem: '));

//readdir$('./')
//    .mergeMap(files => Rx.Observable.from(files))
//    .map(file =>  `${file} - i chuj`)
//    //.map(file =>  Rx.Observable.of(file, readFile$(file)))
//    //.mergeMap(pair => `${pair} ${pair[0]} -- ${pair[1]}`)
//    .subscribe(createSubscription('nuda: '));


_Rx2.default.Observable.fromPromise(new Promise(function (resolve) {
    setTimeout(function () {
        resolve('pojszło');
    }, 1000);
})).subscribe((0, _subscriptionScript.createSubscription)('zrpomisa: '));

readdir$('./').mergeMap(function (files) {
    return _Rx2.default.Observable.from(files);
}).map(function (file) {
    return _Rx2.default.Observable.fromPromise(new Promise(function (resolve) {
        var result = '';
        //duze uproszczenie lepszy byl bys tat
        if (/\S+\.\S+/.test(file)) {
            return readFile$(file).subscribe({
                next: function next(chunk) {
                    result += chunk;
                },
                complete: function complete() {
                    resolve(file + ' ===>  \n\n ' + result + ' \n');
                },
                error: function error(e) {
                    console.error(e);
                }
            });
        }
        return resolve(file + ' ===>  \n is dir or stuff \n');
    }));
}).flatMap(function (x) {
    return x;
})
//.map(file =>  Rx.Observable.of(file, readFile$(file)))
//.mergeMap(pair => `${pair} ${pair[0]} -- ${pair[1]}`)
.subscribe((0, _subscriptionScript.createSubscription)('fun: '));