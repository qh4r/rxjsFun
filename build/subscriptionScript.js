"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createSubscription = createSubscription;
function createSubscription(tag) {
    return {
        next: function next(item) {
            console.log(tag + ".next " + item);
        },
        error: function error(_error) {
            console.log(tag + ".error " + (_error.stack || _error));
        },
        complete: function complete() {
            console.log(tag + ".complete");
        }
    };
}