import Rx from 'rxjs/Rx';
import {createSubscription} from './subscriptionScript';

Rx.Observable.interval(1000)
    .take(3)
    .subscribe(
        {
            next(x) {
                console.log(`wbudowany itnerwal: ${x}`)
            }
        });

Rx.Observable.timer(500)
    .subscribe(createSubscription(`wbudowany timer:`));

Rx.Observable.timer(2000, 200)
    .take(5)
    .subscribe(createSubscription(`kilka razy timer 200 + delay 2k:`));

Rx.Observable.of('hello', 1337, 'cos tam', [2, 3, 5, false, false, '77'], {name: 'Ryba'})
    .subscribe(createSubscription('itemy: '));

//z obiektu sie tak nie da
Rx.Observable.from(['kot', 'mysz', 'krzesło', 'pies'])
    .subscribe(createSubscription('itemy z tablicy'));

//iterator wiec mzona robic from z elementow (charow) stringu!
//Rx.Observable.from('dlugi string bardzo dlugi')
//    .subscribe(createSubscription('itemy z stringa: '));

// w esie 6 dziala dla iteratorow i generatorow
//Rx.Observable.from(function*() {
//    let i = 0;
//    while (i++ < 10) yield i;
//}).subscribe(createSubscription('itemy z generatora'));

Rx.Observable.from([2, 3, 4, 2, 5])
    .map(x => x * 2)
    .subscribe(createSubscription(`z mapem: `));

//throw wywoluje callback errora zawsze
//Rx.Observable.throw(new Error('dupa, symulacja'))
//    .subscribe(createSubscription('errrr rr: '));

Rx.Observable.empty()
    .subscribe(createSubscription('pusty observable odrazu sie konczy (ma sens gdy chcemy zwracac cos observable dla konwencji)'));

let test = 0;
const deferer$ = Rx.Observable.defer(() => {
    //tutaj mamy domkniecie
    test++;
    return Rx.Observable.of(test);
});

//TYLKO SUBSKRYBCJA POWODUJE WYWOLANIE DEFERERA -- take 10 daje 1 wynik
deferer$.take(10).subscribe(createSubscription('defererrr: '));
deferer$.subscribe(createSubscription('defererrr: '));

//Never nigdy sie nie konczy!
Rx.Observable.never()
    .subscribe(createSubscription('never: '));

//zwraca zakres od (arg 1), ilosc wystapien (arg 2)
Rx.Observable.range(5,10)
    .subscribe(createSubscription('range: '));

