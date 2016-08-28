import Rx from 'rxjs/Rx';
import {createSubscription} from './subscriptionScript';

//flatMap, mergeMap to aliasy i dziala jak tak selectMany
Rx.Observable.from([
    {name: 'Rafal', surname: 'Kuchar', age: 26, favNumbers: [23,1337,7]},
    {name: 'Romek', surname: 'Afgan', age: 16, favNumbers: [48,0,5,12]},
    {name: 'Łukasz', surname: 'Zdzisz', age: 31, favNumbers: [0,7,215]},
    {name: 'Iza', surname: 'Schiza', age: 18, favNumbers: [3]},
    {name: 'Zbigniew', surname: 'Małysz', age: 24, favNumbers: []}
]).flatMap(x => x.favNumbers)
    .filter(x => x < 100)
    .distinct() //usuwa powtorzenia
    .subscribe(createSubscription('flat/merge: '));

// SWITCHMAP -zwraca ostatnia wartosc jesli w czasie dzialania petli wartosc tego elementu sie zmienila
Rx.Observable.from([
    {name: 'Rafal', surname: 'Kuchar', age: 26, favNumbers: [23,1337,7]},
    {name: 'Romek', surname: 'Afgan', age: 16, favNumbers: [48,0,5,12]},
    {name: 'Łukasz', surname: 'Zdzisz', age: 31, favNumbers: [0,7,215]},
    {name: 'Iza', surname: 'Schiza', age: 18, favNumbers: [3]},
    {name: 'Zbigniew', surname: 'Małysz', age: 24, favNumbers: []}
]).switchMap(x => x.favNumbers)
    .subscribe(createSubscription('switchMap: '));

//merge rozwiazuje promisy
Rx.Observable.range(1,10)
    .mergeMap(x => new Rx.Observable(obs => {
        return setTimeout(() => {
            obs.next(Rx.Observable.of([x - 1, x, x + 1]));
            obs.complete();
        }, 1000); //dzialanie merge map konczy sie (i wszyskto idzie dalej) dopiero gdy rozwiazane zostana observable
    }))
    .do(x => console.log(`zwrocony observable`, x))
    .mergeMap(x => x) //ten merge map rozwiazuje observable zwracany w porpzednim next!
    .do(x => console.log(`wykonano pierwszy merge map: ${x}`))
    .mergeMap(x => x) //dopiero ten mergeMap dziala jak select many
    .subscribe(createSubscription('promise: '));

//JESLI MERGE MAP MA W RETURNIE TABLICE, TO DZIELI JA JAK SELECT MANY

// JESLI MA OBSERVABLE TO STARA SIE GO UKONCZYC I NIC WIECEJ NIE ROBI

///!!!!!!!!
// MERGE MAP DZIALA TAK SAMO Z PROMISAMI!!!!!!!
Rx.Observable.range(1,5)
    .mergeMap(x => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(x * 2), 500);
        })
    })
    .subscribe(createSubscription('merge_promise: '));