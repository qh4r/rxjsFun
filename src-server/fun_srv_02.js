import Rx from 'rxjs/Rx'

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
        var interval = setInterval(() => {
            console.log(`geenrating ${i}`)
            obv.next(`generated -> ${i++}`);
        }, intv);

        ///!!!!!!!!!!!!!!!!!
        // ta funkcja zwracana przez observable to taki dispose
        // wykonywana jest przy unsubscribe errorze lub complete!!!!

        // moze byc tez wywolywana przez operatory np TAKE
        return () => {
            clearInterval(interval);
        }
    })
}

const seconds$ = createInterval$(1000);

//const subscription = seconds$.take(5).subscribe(createSubscription('secs: '));


function take(inputObserver, amount){
    return new Rx.Observable(observer => {
        var sub = inputObserver.subscribe(x => {
            observer.next(x);
            if(amount-- == 0){
                observer.complete();
            }
        });
        //to w celu zachowania ciaglosci
        return () => sub.unsubscribe();
    })
}

take(seconds$, 8).take(4).subscribe(createSubscription('own take '));

//setTimeout(() => {
//   subscription.unsubscribe();
//}, 4000);