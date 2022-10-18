import {
  Timeout,
  TimeoutCallback,
  TimeoutData,
  startTimeout,
  stopTimeout,
} from "./timeout";

export class Timer {
  timeout: Timeout | number;

  constructor(public callback: TimeoutCallback, public interval: number) {
    this.timeout = interval;
  }

  isRunning() {
    return typeof this.timeout !== "number";
  }

  start() {
    if (this.isRunning()) return;
    const handler = (data: TimeoutData) => {
      this.callback(data);
      this.timeout = startTimeout(handler, data.nextTimeout, this.interval);
    };
    this.timeout = startTimeout(handler, <number>this.timeout, this.interval);
  }

  stop() {
    if (!this.isRunning()) return;
    this.timeout = stopTimeout(<Timeout>this.timeout);
  }

  reset() {
    this.stop();
    this.timeout = this.interval;
  }
}
