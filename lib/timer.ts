import {
  Timeout,
  TimeoutCallback,
  TimeoutData,
  startTimeout,
  stopTimeout,
} from "./timeout";

export class Timer {
  #timeout: Timeout | number;

  constructor(readonly interval: number, readonly callback: TimeoutCallback) {
    this.#timeout = interval;
  }

  get timeout() {
    return this.#timeout;
  }

  get isRunning() {
    return typeof this.#timeout !== "number";
  }

  start() {
    if (this.isRunning) return;
    const handler = (data: TimeoutData) => {
      this.callback(data);
      this.#timeout = startTimeout(handler, data.nextTimeout, this.interval);
    };
    this.#timeout = startTimeout(handler, <number>this.#timeout, this.interval);
  }

  pause() {
    if (!this.isRunning) return;
    this.#timeout = stopTimeout(<Timeout>this.#timeout);
  }

  reset() {
    this.isRunning && stopTimeout(<Timeout>this.#timeout);
    this.#timeout = this.interval;
  }
}
