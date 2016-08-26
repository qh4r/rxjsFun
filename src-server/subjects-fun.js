
import Rx from 'rxjs/Rx'
import {createSubscription} from './subscriptionScript'

//
//const firstSubject$ = new Rx.Subject;
//
//firstSubject$.subscribe(createSubscription('1st: '));
//
//firstSubject$.next('haha');
//firstSubject$.next('hihi');
//firstSubject$.next('hoho');
//firstSubject$.next('wait for it...');
//setTimeout(() => firstSubject$.complete(), 1000);


const testSubject$ = new Rx.Subject;
testSubject$.subscribe(createSubscription('test: '));
const timer$ = Rx.Observable.timer(0, 1000).take(5);

timer$.subscribe(testSubject$);

/// subskrypcje zrwacaja wartosci emitowane od miesjca rejestracji ta ponizasza pomija 2 wartosci
setTimeout(() => testSubject$.subscribe(createSubscription('timeout 2k: ')), 2000);


//praktyczny przyklad

// zwykly subject nie przechowuje stanu poczatkowego ani ostatniego
//const currentUser$ = new Rx.Subject;

//BEHAVIOR SUBJECT - Przyjmuje stan poczatkowy ktory bedzie dostarczony tuz po pierwszej rejestracji
// jesli od momentu utworzenia pojawiaja sie nowe stany to zawsze ostatni stan bedzie dostarczany
// dla nowo rejestrujacego sie elementu
const currentUser$ = new Rx.BehaviorSubject({isLoggedIn: false, isAdmin: false});

const isLoggedIn$ = currentUser$.map(x => x.isLoggedIn);

const isAdmin$ = currentUser$.map(x => x.isAdmin);
isLoggedIn$.subscribe(createSubscription('logged: '));
isAdmin$.subscribe(createSubscription('admin: '));

setTimeout(() => isLoggedIn$.subscribe(createSubscription('loggedin 2nd: ')), 1500);
currentUser$.next({isLoggedIn: false, isAdmin: false});
setTimeout(() => currentUser$.next({name: 'adaś' ,isLoggedIn: true, isAdmin: false}), 1000);
setTimeout(() => currentUser$.next({isLoggedIn: false, isAdmin: false}), 2000);
setTimeout(() => currentUser$.next({name: 'qhr' ,isLoggedIn: true, isAdmin: true}), 3000);


//REPLAY ZAPAMIETUJE CALA KOLEJKE I ZWRACA WSZYSTKIE WARTOSCI OD JEJ POCZATKU PRZY REJESTRACJI
// mpodajac liczbe jako parametr tworzymy buffer i tylko tyle wartosci bedzie przechowywane
const replay$ = new Rx.ReplaySubject(3);

replay$.subscribe(createSubscription('replay: '));
replay$.next('raz');
setTimeout(() => replay$.next('dwa'),1000);
setTimeout(() => replay$.next('trzy'),2000);
setTimeout(() => replay$.subscribe(createSubscription('delayed: ')),3000);
setTimeout(() => replay$.next('cztery'),4000);
setTimeout(() => replay$.next('pięć'),5000);
setTimeout(() => replay$.subscribe(createSubscription('delayed more: ')),6000);
setTimeout(() => replay$.next('szesc'),7000);
// ASYNC SUBJECT emituje tylko ostatni stan tuż przed tym jak zostanie ukonczony
// po tym jak zostal completed orazu bedzie daawal ostatnia swoja wartosc kolejnym subskrypcja
const asyncSub$ = new Rx.AsyncSubject;

asyncSub$.next(1);
asyncSub$.subscribe(createSubscription('async1: '));
asyncSub$.next(2);

setTimeout(() => asyncSub$.subscribe(createSubscription('async2: ')), 2000);

setTimeout(() => {
        console.log('completed')
        asyncSub$.complete();
    }, 3000
);

setTimeout(() => asyncSub$.subscribe(createSubscription('async3: ')), 4000);

asyncSub$.next(3);