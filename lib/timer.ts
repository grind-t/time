import {
  Timeout,
  TimeoutCallback,
  TimeoutData,
  startTimeout,
  stopTimeout,
} from "./timeout";

export class Timer {
  #timeout: Timeout | number;
  #interval: number;
  #callback: TimeoutCallback;

  constructor(interval: number, callback: TimeoutCallback) {
    this.#timeout = interval;
    this.#interval = interval;
    this.#callback = callback;
  }

  get timeout() {
    return this.#timeout;
  }

  get interval() {
    return this.#interval;
  }

  get callback() {
    return this.#callback;
  }

  get isRunning() {
    return typeof this.#timeout !== "number";
  }

  start() {
    if (this.isRunning) return;
    const handler = (data: TimeoutData) => {
      this.#callback(data);
      this.#timeout = startTimeout(handler, data.nextTimeout, this.#interval);
    };
    this.#timeout = startTimeout(
      handler,
      <number>this.#timeout,
      this.#interval
    );
  }

  pause() {
    if (!this.isRunning) return;
    this.#timeout = stopTimeout(<Timeout>this.#timeout);
  }

  reset() {
    this.isRunning && stopTimeout(<Timeout>this.#timeout);
    this.#timeout = this.#interval;
  }
}
