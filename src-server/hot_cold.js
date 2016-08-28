import Rx from 'rxjs/Rx';
import {createSubscription} from './subscriptionScript';

//Przyklad cold observable
// subskrybjca zawsze zwraca dane od poczatku i zasubskrybowanie inicjalizuje generacje
const interval$ = Rx.Observable.interval(1000)
    .take(5);

setTimeout(() => {
    interval$.subscribe(createSubscription('outer_interval: '));

    setTimeout(() => {
        interval$.subscribe(createSubscription('inner_interval: '));
    }, 2000);

}, 2000);

// publish powoduje ze staje sie hot - jest wspulna dla wszystkich a stare wartosci przemilaja
const hot_interval$ = Rx.Observable.interval(1000)
    .take(5)
    .publish();

// generacja nioe nastapi przed wywolanie connect!
//hot_interval$.connect();

console.log(Date.now());
setTimeout(() => {
    hot_interval$.subscribe(createSubscription('outer_hot: '));
    console.log(Date.now());
    setTimeout(() => {
        hot_interval$.subscribe(createSubscription('inner_hot: '));
        console.log(Date.now());

        setTimeout(() => {
            hot_interval$.connect();
            console.log(Date.now());
            setTimeout(() => hot_interval$.subscribe(createSubscription('late_to_party_hot: ')), 4000);
            setTimeout(() => hot_interval$.subscribe(createSubscription('after_hot: ')), 7000);
        }, 1000);

    }, 2000);

}, 2000);

//publish Last - zawsze zwroci osattni
//publish Replay - zawsze zwraca to co juz bylo zachowane (zaelzene od argumentu) podczas rejestracji
const zipped$ = Rx.Observable.zip(
    Rx.Observable.from([32, 12, 3, 45, 2, 31]),
    Rx.Observable.of('A', 'B', 'C', 'D'),
    (x, y) => x + y)
    .map(x => {
        console.log(x);
        return x.toLowerCase();
    })
    //.publish()
    //.publishLast()
    .publishReplay(2)
    // REFCOUNT - sprawia ze connect sam wywolywany jest podczas pierwszej subskrycji a konczony przy ostatniej unsubscribe
    .refCount()
    //.share() // < == .publish().refCount() -- taki skrót -- wyglada na to ze jednak tak nie dziala

// SHARE BARDZO PRZYDAJE SIE PODCZAS OBSLUGI SOCKETOW

zipped$.subscribe(createSubscription('zipped_1: '));
//setTimeout(() => zipped$.connect(), 2000);
setTimeout(() => zipped$.subscribe(createSubscription('zipped_2: ')), 3000);
setTimeout(() => zipped$.subscribe(createSubscription('zipped_3: ')), 6000);

