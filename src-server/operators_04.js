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

