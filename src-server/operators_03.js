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

//buffer zwraca tablice z elementow ktore nadeszly w zaleznosci od typu i parametrow
Rx.Observable.interval(200)
    .take(20)
    .bufferCount(5) //grupuje po ilosci otrzymanych
    //.bufferTime(150) //w milisekundach - zwraca grupy w czasie
    // jesli w przedziale czasowym nie bedzie wartosci - zwroci psuta tablice
    .subscribe(createSubscription('buffer: '));

Rx.Observable.timer(1000,500)
    .take(20)
    .buffer(Rx.Observable.interval(1500)) // w tym wypadku dziala tak jak buffer time
    // - tutaj sygnalem naoproznienie buffera jest sygnal z observable
    .subscribe(createSubscription('buffer from rx: '));

//To array zbiera calosc i emituje dopiero na evencie complete
Rx.Observable.interval(200)
    .take(10)
    .toArray()
    .subscribe(createSubscription('toArray: '));