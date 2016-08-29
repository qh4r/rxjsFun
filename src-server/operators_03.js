import Rx from 'rxjs/Rx';
import {createSubscription} from './subscriptionScript';

//reduce czeka na wykonanie calosci przed przekazaniem dalej
Rx.Observable.interval(200)
    .startWith(15)
    .take(10)
    //REDUCE NIE ROZWIAZUJE PROMISOW
    //.reduce((s, x) => new Promise((resolve) => {
    //        setTimeout(() =>  resolve(s + x), 500);
    //    }, 0
    //))
    .reduce((s, x) => s + x, 0)
        .subscribe(createSubscription('reduce: '));

// scan działa dokładnie jak reduce ale zwraca aktualny wynik po każdym przetworzony elemencie
// (i nie blokuje ruchu do zebrania wszystkich)
Rx.Observable.interval(200)
    .startWith(15)
    .take(10)
    // scan też NIE ROZWIAZUJE PROMISOW
    //.scan((s, x) => new Promise((resolve) => {
    //        setTimeout(() =>  resolve(s + x), 500);
    //    }, 0
    //))
    .scan((s, x) => s + x, 0)
    .subscribe(createSubscription('scan: '));