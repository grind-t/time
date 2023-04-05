# Why
`setTimeout` may not work precisely ([docs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)), so this library implements two primitives for working with time taking into account the error margin.

# How
## Timeout
The `startTimeout` function is used to start a timeout:
```js
const timeout = startTimeout(({
    deltaTime, // The actual elapsed time in milliseconds
    totalError, // The overall time error in milliseconds
    error, // The error within the range of the specified delay
    hiddenIntervals, // The time taken by extra delays
    nextTimeout, // The next delay taking into account the error
}) => {
    startTimeout(
        noop, // The callback function
        nextTimeout, // The actual delay taking into account the error
        1000 // The ideal delay (if there were no errors)
    );
}, 1000)
```
The `stopTimeout` function is used to stop a timeout:
```js
// The function returns the remaining time until the timeout completes
const remainging = stopTimeout(timeout);
```
## Timer
The `Timer` class is used to create a timer that automatically takes into account the error:
```js
const interval = 1000;

const timer = new Timer(interval, ({ deltaTime }) => {
    console.log(`elapsed: ${deltaTime}`);
});

timer.start(); // Start the timer
timer.pause(); // Pause the timer
timer.reset(); // Reset the timer
```