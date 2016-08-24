import Rx from 'rxjs/Rx';
import $ from 'jquery';
import {createSubscription} from '../build/subscriptionScript';

window.onload = ()=> {
    console.log('no kurwa')
};
const rdy$ = Rx.Observable.fromEvent(window, 'load');
console.log('rdy', rdy$);
rdy$.first()
    .subscribe(null, null, ()=> {
        const $klikBtn = $('#klik1');
        console.log('loaded', $klikBtn);
        Rx.Observable.fromEvent($klikBtn, 'click')
            .subscribe({
                next(x) {
                    for(var elem in x.target){
                        console.log(`${elem} => ${x.target[elem]}`)
                    }
                },
                complete() {
                    console.log(`eot`)
                }
            });
    });

Rx.Observable.from([1, 2, 3, 4]).subscribe(createSubscription('asd: '));
