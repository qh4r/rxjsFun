import Rx from 'rxjs/Rx'
import {createSubscription} from './subscriptionScript'
import fs from 'fs';

fs.readdir('./', (err, res) => {
    if (err) {
        return console.log(err);
    }
    console.log(res);
});

const readdir$ = Rx.Observable.bindNodeCallback(fs.readdir);
const readFile$ = Rx.Observable.bindNodeCallback(fs.readFile);
//Rx.Observable.of('asdsadd dsadd asdasd asd asdsa sadas').flatMap(x => x.split(' ')).subscribe(createSubscription('split: '));

readdir$('./')
    .flatMap(x => x)
    .subscribe(createSubscription('callbackiem: '));

//readdir$('./')
//    .mergeMap(files => Rx.Observable.from(files))
//    .map(file =>  `${file} - i chuj`)
//    //.map(file =>  Rx.Observable.of(file, readFile$(file)))
//    //.mergeMap(pair => `${pair} ${pair[0]} -- ${pair[1]}`)
//    .subscribe(createSubscription('nuda: '));


Rx.Observable.fromPromise(new Promise((resolve)=> {
        setTimeout(()=> {
            resolve('pojszło');
        }, 1000);
    }))
    .subscribe(createSubscription('zrpomisa: '));

readdir$('./')
    .mergeMap(files => Rx.Observable.from(files))
    .map(file =>  Rx.Observable.fromPromise(new Promise(resolve => {
        let result = '';
        //duze uproszczenie lepszy byl bys tat
        if(/\S+\.\S+/.test(file)) {
           return readFile$(file).subscribe({
                next(chunk){
                    result += chunk;
                },
                complete(){
                    resolve(`${file} ===>  \n\n ${result} \n`);
                },
                error(e){
                    console.error(e)
                }
            });
        }
        return resolve(`${file} ===>  \n is dir or stuff \n`);
    })))
    .flatMap(x => x)
    //.map(file =>  Rx.Observable.of(file, readFile$(file)))
    //.mergeMap(pair => `${pair} ${pair[0]} -- ${pair[1]}`)
    .subscribe(createSubscription('fun: '));