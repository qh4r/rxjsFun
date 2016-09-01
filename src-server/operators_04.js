import Rx from 'rxjs/rx';
import {createSubscription} from './subscriptionScript';

var start = new Date().getTime();
Rx.Observable.interval(100)
    //.skip(5)
    //.skipWhile(x => (x % 2) == 0) // while nie dziala po tym jak raz przestanie - tu pomija tylko 0
    // jest tez takeWhile dzialajace podobnie
    .skipUntil(new Rx.Observable(obv => { // TO NIE COMPLETE A NEXT POWODUJE ODBLOKOWANIE RESZTY CIĄGU!!!!
            setTimeout(() => {
                obv.next('go');
                obv.complete()
                }, 800
            );
        }
    ))
    //skip i take Until dzialaja do momentu yielda z przekazanego im observable
    .take(20)
    .bufferCount(4)
    //.last() //first, last zwracaja pierwszy lub ostatni yield streamu --
    // last konczy po jego calym wykonani u.
    // first konczy po pierwszym yieldzie
    .first()
    //.single() //wysypuje sie jesli jest wiecej niz jeden yield
    .subscribe(
        (x) => {
            console.log(`${ new Date() - start } single next: ${x}`);
        },
        null,
        () => {

            console.log(`${ new Date().getTime() - start } complete next:`);
        }
    );

// zip zwroci tylko tyle elementow ile par zdola polaczyc, dopasuje sie do krotszej z kolekcji
Rx.Observable.of('asdfghjl')
    .flatMap(x => x.toUpperCase())
    .zip(Rx.Observable.range(1,10), (x,y) => x+y)
    .subscribe(createSubscription('zip:'));

// bierze zawsze najswiezsze z drugiej kolekcji i dodaje je do tego co jest w 1 -- w formie tablicy
// withLatestFrom emituje tylko gdy pojawi sie nowa wartosc w pierwszym zrodle
Rx.Observable.interval(700)
    //.withLatestFrom(Rx.Observable.interval(250))
        //COMbINE LATEST - emituje wartosc gdy ktorykolwiek z observabli ja emituje
    .combineLatest(Rx.Observable.interval(250))
    .subscribe((array) => console.log(`${array[0]} <-latest-> ${array[1]}`));

Rx.Observable.range(110,10)
    //jesli error jest 2 argumentem to wystapi dopiero po udanej konkatenacji obu zakresow jesli jest pierwszy
    // to wypisany zostanie tylko pierwszy zakres a potem wyrzucony zostanie eeror
    //.concat(Rx.Observable.range(1,10), Rx.Observable.throw(new Error('test')))
    .retry(3) //powtarza po errorze
    .concat(Rx.Observable.throw(new Error('test')), Rx.Observable.range(1,10))
    .catch(error => Rx.Observable.of(error)) //sposob na handlowanie errorow
    .subscribe(createSubscription('tryCatch: '));
