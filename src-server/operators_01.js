import Rx from 'rxjs/Rx';
import {createSubscription} from './subscriptionScript';

Rx.Observable.range(1, 10)
    .do(x => console.log(x)) // wykonuje operacje nie wplywajaca na ciag,
     //do dalszego operatora przekazywane jest to samo co do 'do'
    .finally(x => console.log(`finally wykonuje sie tylko po zakonczeniu sekwencji w range`))
    //finally wywola sie gdy wywlonae zostanie 'complete' w observablu przed nim
    .map(x => x * x)
    .subscribe(createSubscription('range: '));

Rx.Observable.range(1, 10)
    .map(x => x*x)
    .filter(x => x % 2 != 0)
    .subscribe(createSubscription('fitler: '));


//CONCAT - doadaje jedno po drugin (strumienie)
//Merge - miesza między sobą chunki dwóch strumieni (łącząc je)

Rx.Observable.interval(500)
    .startWith(-2, 1, 1337, -3) // dodaje elementy na poczatku sekwencji (do poprzedniego observable),
    // DODAWANE ODRAZU nie w odstepie 500
    .take(3)
    .subscribe(x => console.log(`interval1: ${x}`));


Rx.Observable.interval(250)
    .merge(Rx.Observable.interval(500))
    .take(10)
    .subscribe(x => console.log(`merge: ${x}`), null,() => {
        Rx.Observable.range(10,4) // jesli odwrocily to interval zapcha cala kolejke i merge w concacie nigdy nie  nastapi
            .concat(Rx.Observable.interval(200))
            .take(10)
            .subscribe(createSubscription('concat: '));
    });

//alternatywne uzycie obu operatorow
//merge uzyty na kolekcjach na ktore nie trzeba oczekiwac laczy je tak jak concat
// kolekcja gotowa od poczatku zostaje wepchnieta na poczatek zwroconel lsity
Rx.Observable.merge(
    Rx.Observable.interval(200).take(5),
    Rx.Observable.from([12,32,53,12,53,31]),
    Rx.Observable.of('kot', 'pies', 'szczeniak', 'szafka', 'teleskop'))
    .subscribe(createSubscription('merge alt: '));