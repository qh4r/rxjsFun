import $ from 'jquery';

const $title = $('#title');
const $results = $('#results');

//ta funkcja pokazuje dziwne zachowanie
//na safari !!to z raz ustawionym timeoutem zawsze bedzie zwracalo true w przypadku !!to
// nawet gdy ten juz przeminie albo dostanie clear
// jednak koercja (w if) zwraca odpowiednie wartosci
var fun = (function(){var to = null; return function(){if(to){clearTimeout(to); console.log('jeszcze nie', !!to);} else {console.log('nima', !!to)} to = setTimeout(function(){console.log('done')}, 2000);}})()

let lastQuerry = null;
let timeout = null;
let currentQuerryId = 0;
$title.on('keyup', e => {

   const title = e.target.value;

    if(title == lastQuerry){
        return;
    }

    lastQuerry = title;

    let querryId = ++currentQuerryId;

    if(timeout){
        clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
        getItems(title, querryId)
            .then(data => {
                if(data.id != currentQuerryId){
                    return;
                }
                $results.empty();
                //const $items = items.map(item => $(`<li>${item}</li>`));
                //rownoznaczne
                const $items = data.items.map(item => $(`<li />`).text(item));
                $results.append($items);
            })
    }, 500);
});

function getItems(title, querryId) {
    console.log(`querry to ${title}, id: ${querryId}`);
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            resolve({items: [title, 'Item 2', `Another ${Math.random()}`], id: querryId})
        }, 500 + (Math.random() * 2000));
    })
}