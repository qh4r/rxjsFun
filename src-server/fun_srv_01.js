import Rx from 'rxjs/Rx'

//promisy rozwiaza sie nawet jesli sie na nie nie zarejestruje. promise zaczyna wykonanie tuz po utworzeniu
(() => {
    const promise = new Promise((resolve, reject) => {
        console.log('cos tam');
        return setTimeout(() => {
            console.log('no poszlo');
            resolve('great successs');
        }, 2000)
    });
    promise.then(console.log);

    const promise2 = new Promise((resolve, reject) => {
        console.log('\tbez rejestracji');
        return setTimeout(() => {
            console.log('\tbez rejestracji tez poszlo no poszlo');
            resolve('\tnikt tego nie odczyta');
        }, 2000)
    });
})();

//WYWOLANIE RRORA RPZERYWA DALSZE WYKONANIE
// w przeciwienstwie promisow observable sa leniwe - nie odpala sie do momentu subskrypcji
(() => {
    const simple$ = new Rx.Observable(observer => {
        console.log('observable started');
        let i = 0;
        (function callback() {
            setTimeout(() => {
                //observer.error('asd')
                observer.next(`nowy item ${i++}`);
                i < 4 ? callback() : observer.complete('complete');
            }, 1000);
        })();
    });
    //# next, error, complete // w complete undefined
    simple$.subscribe(console.log, console.error, x => console.log(`completed => ${x}`));

    // observable są reużywalne, w przeciwienstwie do promisow, moge sie nawet zazwbac
    setTimeout(() => {
        console.log('druga runda');
        simple$.subscribe(console.log, console.error, x => console.log(`completed => ${x}`));
    }, 5000)
})();

(() => {
    const interval$ = new Rx.Observable(observer => {
        let i = 0;
        var interval = setInterval(() => {
            observer.next(`nastepnee ${i = Math.random() * 10}`)
            if (i < 1) {
                clearInterval(interval);
                console.log('eot');
                observer.complete();
            }
            if (i > 9) {
                clearInterval(interval);
                observer.error('bum');
            }
        }, 500)
    });

    interval$.subscribe(console.log, console.error);
})();


// nowy sposob na deklaracje obieku zawierajacego funkcje ponizej tak jak fun(){...} === fun: funkcja(){...}
function createSubscription(tag) {
    return {
        next(item) {
            console.log(`${tag}.next ${item}`);
        },
        error(error) {
            console.log(`${tag}.error ${error.stack || error}`);
        },
        complete() {
            console.log(`${tag}.complete`);
        }
    }
}

function createInterval$(intv){
    let i = 0;
    return new Rx.Observable(obv => {
        setInterval(() => {
            obv.next(i++);
        }, intv);
    })
}
const eachSecond$ = createInterval$(1000);
//obiekt sformatowany jak tenn z create subscription (czyli zawieracjacy funkcje next error i complete
// mozna rpzekazac do subscribe
eachSecond$.subscribe(createSubscription('each second: '));
