import Rx from 'rxjs/Rx';
import $ from 'jquery';
//const rdy$ = Rx.Observable.fromEvent(window, 'load');

const $drag = $('#drag');
const $document = $(document);
const $dropAreas = $('.drop-area');
const $body = $('body');

const beginDrag$ = Rx.Observable.fromEvent($drag, 'mousedown');
const endDrag$ = Rx.Observable.fromEvent($document, 'mouseup');
const mouseMove$ = Rx.Observable.fromEvent($document, 'mousemove');

const currentArea$ = Rx.Observable.merge(
    Rx.Observable.fromEvent($dropAreas, 'mouseover').map(e => $(e.target)),
    Rx.Observable.fromEvent($dropAreas, 'mouseout').map(e => null)
);

const drops$ = beginDrag$
    .do(e => {
        e.preventDefault();
        $drag.addClass('dragging');
    })
    .mergeMap(startEvent => {
        return mouseMove$
            .do(() => $body.append($drag))
            .takeUntil(endDrag$)
            .do(mouseEvent => moveDrag(startEvent, mouseEvent))
            .last()
            .withLatestFrom(currentArea$, (move, $area) => {
                return {area: $area, move: move, start: startEvent}
            })
    })
    .do((args) => {
        $drag.removeClass('dragging');

        $drag.css({
            top: 0, left: 0
        });
        //.animate({top: 0, left: 0}, 250);
    });

drops$.subscribe(args => {
    const $dropArea = args.area;
    $dropAreas.removeClass('dropped');
    $dropArea && $dropArea.addClass('dropped');
    ($dropArea || $body).append($drag);
    console.log($dropArea);
});

function moveDrag(startEvent, moveEvent) {
    $drag.css({
        left: moveEvent.clientX,
        top: moveEvent.clientY
    })
}