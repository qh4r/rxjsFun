import $ from 'jquery'
import Rx from 'rxjs/Rx'

const $title = $('#title');
const $results = $('#results');

const keyUps$ = Rx.Observable.fromEvent($title, 'keyup');
const queries$ = keyUps$
    .map(e => e.target.value)
    .distinctUntilChanged()
    .debounceTime(500)
    .switchMap(x => {
        console.log(x);
        return getItems(x)
    });

queries$.subscribe(data => {
        $results.empty();
        const $items = data.items.map(item => $('<li/>').text(item));
        $results.append($items);
});

function getItems(title, querryId) {
    console.log(`querry to ${title}, id: ${querryId}`);
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            resolve({items: [title, 'Item 2', `Another item ${Math.random()}`], id: querryId})
        }, 500 + (Math.random() * 2000));
    })
}